import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import {
  Transaction,
  TransactionDocument,
} from '../../schemas/transaction.schema';
import { StellarService } from '../stellar/stellar.service';
import { SendXlmDto } from './dto/send-xlm.dto';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    private stellarService: StellarService,
  ) {}

  async getBalance(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    try {
      return await this.stellarService.getBalance(user.walletAddress);
    } catch (error) {
      this.logger.error(`Failed to get balance: ${error.message}`);
      throw new BadRequestException(error.message || 'Failed to get balance');
    }
  }

  async getSeekerBalance(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return {
      balance: user.seekerBalance || 0,
      symbol: 'SEEKER',
    };
  }

  async getTransactions(userId: string, page: number = 1, limit: number = 20) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    try {
      const all = await this.stellarService.getTransactions(
        user.walletAddress,
        page * limit,
      );

      // Paginate after fetching from Horizon
      const start = (page - 1) * limit;
      return all.slice(start, start + limit);
    } catch (error) {
      this.logger.error(`Failed to get transactions: ${error.message}`);
      throw new BadRequestException('Failed to get transactions');
    }
  }

  async sendXlm(userId: string, sendXlmDto: SendXlmDto) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new BadRequestException('User not found');

    try {
      if (!this.stellarService.isPublicAddress(sendXlmDto.toAddress)) {
        throw new BadRequestException('Invalid recipient address');
      }

      let signature: string;

      if (user.dWalletId) {
        // ── Non-custodial path: Ika dWallet signing (pre-alpha mock) ──────
        const { signTransfer } = await import('../../services/ika.js');
        signature = await signTransfer({
          fromAddress: user.walletAddress,
          encryptedSecret: user.encryptedPrivateKey,
          toAddress: sendXlmDto.toAddress,
          amount: sendXlmDto.amount,
          memo: sendXlmDto.memo ?? '',
        });
        this.logger.log(`Ika signature committed for user ${userId}`);
      } else {
        // ── Custodial path ───────────────────────────────────────────────
        signature = await this.stellarService.sendTransaction(
          user.walletAddress,
          user.encryptedPrivateKey,
          sendXlmDto.toAddress,
          sendXlmDto.amount,
          sendXlmDto.memo,
        );
      }

      await this.transactionModel.create({
        user: userId,
        signature,
        type: 'send',
        amount: sendXlmDto.amount,
        fromAddress: user.walletAddress,
        toAddress: sendXlmDto.toAddress,
        status: 'confirmed',
        memo: sendXlmDto.memo,
      });

      return {
        signature,
        amount: sendXlmDto.amount,
        toAddress: sendXlmDto.toAddress,
        status: 'confirmed',
      };
    } catch (error) {
      this.logger.error(`Failed to send XLM: ${error.message}`);
      throw new BadRequestException(error.message || 'Failed to send XLM');
    }
  }

  async sendXlmToUser(
    userId: string,
    username: string,
    amount: number,
    memo?: string,
  ) {
    const sender = await this.userModel.findById(userId);
    if (!sender) {
      throw new BadRequestException('Sender not found');
    }

    const recipient = await this.userModel.findOne({ username });
    if (!recipient) {
      throw new BadRequestException(`User @${username} not found`);
    }

    if (recipient._id.toString() === userId) {
      throw new BadRequestException('Cannot send to yourself');
    }

    try {
      const signature = await this.stellarService.sendTransaction(
        sender.walletAddress,
        sender.encryptedPrivateKey,
        recipient.walletAddress,
        amount,
        memo || `Sent to @${username}`,
      );

      await this.transactionModel.create({
        user: userId,
        signature,
        type: 'send',
        amount,
        fromAddress: sender.walletAddress,
        toAddress: recipient.walletAddress,
        status: 'confirmed',
        memo: memo || `Sent to @${username}`,
      });

      return {
        signature,
        amount,
        recipient: {
          username: recipient.username,
          name: recipient.name,
          avatar: recipient.avatar,
          walletAddress: recipient.walletAddress,
        },
        status: 'confirmed',
      };
    } catch (error) {
      this.logger.error(`Failed to send XLM to user: ${error.message}`);
      throw new BadRequestException(
        error.message || 'Failed to send XLM to user',
      );
    }
  }

  async getTransactionDetails(userId: string, signature: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    try {
      return await this.stellarService.getTransactionDetails(signature);
    } catch (error) {
      this.logger.error(`Failed to get transaction details: ${error.message}`);
      throw new BadRequestException('Failed to get transaction details');
    }
  }
}
