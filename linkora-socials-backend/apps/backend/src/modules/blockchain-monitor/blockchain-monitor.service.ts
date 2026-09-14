import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { User, UserDocument } from '../../schemas/user.schema';
import { StellarService } from '../stellar/stellar.service';
import { NotificationsService } from '../notifications/notifications.service';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class BlockchainMonitorService implements OnModuleInit {
  private readonly logger = new Logger(BlockchainMonitorService.name);
  private lastCheckedCursors: Map<string, string> = new Map(); // walletAddress -> Horizon paging_token

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private stellarService: StellarService,
    private notificationsService: NotificationsService,
    private firebaseService: FirebaseService,
  ) {}

  async onModuleInit() {
    this.logger.log('Blockchain Monitor Service initialized');
    // Start monitoring immediately
    await this.monitorIncomingTransactions();
  }

  /**
   * Monitor all user wallets for incoming transactions.
   * Runs every 30 seconds.
   */
  @Cron(CronExpression.EVERY_30_SECONDS)
  async monitorIncomingTransactions() {
    try {
      // Only monitor users who can receive push notifications
      const users = await this.userModel
        .find({ expoPushToken: { $exists: true, $ne: null } })
        .select('walletAddress expoPushToken username')
        .lean();

      if (users.length === 0) {
        return;
      }

      this.logger.debug(
        `Monitoring ${users.length} wallets for incoming payments`,
      );

      await Promise.all(users.map((user) => this.checkWalletPayments(user)));
    } catch (error) {
      this.logger.error(`Error monitoring payments: ${error.message}`);
    }
  }

  /**
   * Check a specific wallet for new incoming payments via Horizon.
   */
  private async checkWalletPayments(user: any) {
    try {
      const server = this.stellarService.getServer();
      const lastCursor = this.lastCheckedCursors.get(user.walletAddress);

      // Initial scan: baseline the cursor over the most recent payments
      // so we never notify about historical activity.
      if (!lastCursor) {
        const recent = await server
          .payments()
          .forAccount(user.walletAddress)
          .limit(10)
          .order('desc')
          .call();
        if (recent.records.length > 0) {
          this.lastCheckedCursors.set(
            user.walletAddress,
            recent.records[0].paging_token,
          );
        }
        return;
      }

      const page = await server
        .payments()
        .forAccount(user.walletAddress)
        .cursor(lastCursor)
        .order('asc')
        .limit(100)
        .call();

      const newPayments = page.records.filter(
        (p: any) => p.paging_token > lastCursor,
      );

      if (newPayments.length === 0) {
        return;
      }

      this.lastCheckedCursors.set(
        user.walletAddress,
        newPayments[newPayments.length - 1].paging_token,
      );

      for (const payment of newPayments) {
        if (await this.isIncomingPayment(user.walletAddress, payment)) {
          await this.handleIncomingPayment(payment, user);
        }
      }
    } catch (error) {
      this.logger.warn(
        `Error checking wallet ${user.walletAddress}: ${error.message}`,
      );
    }
  }

  /**
   * Check if a payment record is an incoming native (XLM) payment to the user.
   */
  private async isIncomingPayment(
    userWalletAddress: string,
    payment: any,
  ): Promise<boolean> {
    if (payment.asset_type !== 'native') {
      return false; // Only notify for XLM for now
    }
    if (payment.to !== userWalletAddress) {
      return false;
    }
    if (payment.from === userWalletAddress) {
      return false; // Self-payment
    }
    return payment.transaction_successful !== false;
  }

  /**
   * Handle an incoming payment - send notification.
   */
  private async handleIncomingPayment(payment: any, user: any) {
    try {
      const amountXlm = parseFloat(payment.amount || '0');
      const senderAddress = payment.from || payment.source_account;

      // Check if sender is a Linkora user
      const senderUser = await this.userModel
        .findOne({ walletAddress: senderAddress })
        .select('_id username name')
        .lean();

      let message: string;
      const notificationData: any = {
        recipient: user._id,
        type: 'payment_received',
        amount: amountXlm,
        signature: payment.transaction_hash,
      };

      if (senderUser) {
        // Payment from another Linkora user
        message = `${senderUser.username || senderUser.name} sent you ${amountXlm.toFixed(4)} XLM`;
        notificationData.sender = senderUser._id;
        notificationData.message = message;
      } else {
        // Payment from an external wallet
        message = `You received ${amountXlm.toFixed(4)} XLM from ${this.shortenAddress(senderAddress)}`;
        notificationData.message = message;
        // For external payments, we need a sender - use the recipient for schema requirement
        notificationData.sender = user._id;
      }

      // Send push notification via Firebase
      if (user.expoPushToken) {
        await this.firebaseService.sendPushNotification(
          user.expoPushToken,
          'Payment Received',
          message,
          {
            signature: payment.transaction_hash,
            amount: amountXlm.toString(),
            type: 'payment',
          },
        );
      }

      // Create in-app notification
      await this.notificationsService.createNotification(notificationData);

      this.logger.log(
        `Notified ${user.username} of incoming ${amountXlm.toFixed(4)} XLM`,
      );
    } catch (error) {
      this.logger.error(`Error handling incoming payment: ${error.message}`);
    }
  }

  /**
   * Shorten a Stellar address for display.
   */
  private shortenAddress(address: string): string {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }

  /**
   * Manually trigger a check for a specific wallet (useful for testing).
   */
  async checkWalletNow(walletAddress: string) {
    const user = await this.userModel
      .findOne({ walletAddress })
      .select('walletAddress expoPushToken username _id')
      .lean();

    if (!user) {
      throw new Error('User not found');
    }

    await this.checkWalletPayments(user);
    return { message: 'Wallet checked successfully' };
  }
}
