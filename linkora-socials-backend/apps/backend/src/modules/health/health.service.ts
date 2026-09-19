import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { StellarService } from '../stellar/stellar.service';
import { EmailService } from '../email/email.service';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
    private readonly stellarService: StellarService,
    private readonly emailService: EmailService,
    private readonly uploadService: UploadService,
  ) {}

  /**
   * Basic health check
   */
  async checkHealth() {
    const startTime = Date.now();

    try {
      // Check MongoDB
      const dbStatus =
        this.mongoConnection.readyState === 1 ? 'healthy' : 'unhealthy';

      // Check Stellar (simple check)
      let stellarStatus = 'healthy';
      try {
        await this.stellarService.getServer().transactions().limit(1).call();
      } catch (error) {
        stellarStatus = 'unhealthy';
      }

      // Check Email (Resend primary, Gmail SMTP fallback)
      let emailStatus = 'healthy';
      try {
        if (!this.emailService.getProvider()) {
          emailStatus = 'unhealthy';
        }
      } catch (error) {
        emailStatus = 'unhealthy';
      }

      // Check Upload (Cloudinary)
      let uploadStatus = 'healthy';
      try {
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
        if (!cloudName || !uploadPreset) {
          uploadStatus = 'unhealthy';
        }
      } catch (error) {
        uploadStatus = 'unhealthy';
      }

      const responseTime = Date.now() - startTime;
      const isHealthy =
        dbStatus === 'healthy' &&
        stellarStatus === 'healthy' &&
        emailStatus === 'healthy' &&
        uploadStatus === 'healthy';

      return {
        status: isHealthy ? 'ok' : 'degraded',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        responseTime: `${responseTime}ms`,
        services: {
          database: dbStatus,
          stellar: stellarStatus,
          email: emailStatus,
          upload: uploadStatus,
        },
      };
    } catch (error) {
      this.logger.error('Health check failed:', error);
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  }

  /**
   * Detailed health check with more information
   */
  async checkDetailedHealth() {
    const startTime = Date.now();

    try {
      // MongoDB details
      const dbHealth = {
        status:
          this.mongoConnection.readyState === 1 ? 'connected' : 'disconnected',
        readyState: this.mongoConnection.readyState,
        host: this.mongoConnection.host,
        name: this.mongoConnection.name,
      };

      // Stellar details
      const horizonUrl =
        process.env.STELLAR_HORIZON_URL ||
        (this.stellarService.getNetwork() === 'public'
          ? 'https://horizon.stellar.org'
          : 'https://horizon-testnet.stellar.org');

      const stellarHealth: any = {
        status: 'unknown',
        network: this.stellarService.getNetwork(),
        horizonUrl,
      };

      try {
        const res = await fetch(horizonUrl);
        const root = await res.json();
        stellarHealth.status =
          root.health === 'healthy' ? 'connected' : 'degraded';
        stellarHealth.coreVersion = root.core_version;
        stellarHealth.protocolVersion = root.protocol_version;
        stellarHealth.latestLedger = root.history_latest_ledger;
        stellarHealth.networkPassphrase = root.network_passphrase;
      } catch (error) {
        stellarHealth.status = 'error';
        stellarHealth.error = error.message;
      }

      // Email provider details
      const emailHealth: any = {
        status: 'unknown',
        provider: this.emailService.getProvider() || 'none',
      };

      try {
        const resendKey = process.env.RESEND_API_KEY;
        const gmailUser = process.env.GMAIL_USER;
        const gmailPass = process.env.GMAIL_APP_PASSWORD;

        if (resendKey) {
          emailHealth.status = 'configured';
          emailHealth.fromEmail =
            process.env.RESEND_FROM || 'Linkora <noreply@linkora.social>';
          emailHealth.apiKeySet = true;
        } else if (gmailUser && gmailPass) {
          emailHealth.status = 'configured';
          emailHealth.fromEmail =
            process.env.GMAIL_FROM || `Linkora <${gmailUser}>`;
          emailHealth.user = gmailUser;
          emailHealth.apiKeySet = true;
        } else {
          emailHealth.status = 'error';
          emailHealth.error =
            'No provider configured (set RESEND_API_KEY or GMAIL_USER/GMAIL_APP_PASSWORD)';
        }
      } catch (error) {
        emailHealth.status = 'error';
        emailHealth.error = error.message;
      }

      // Upload (Cloudinary) details
      const uploadHealth: any = {
        status: 'unknown',
        provider: 'Cloudinary',
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      };

      try {
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

        if (cloudName && uploadPreset) {
          uploadHealth.status = 'configured';
          uploadHealth.uploadPreset = uploadPreset;
          uploadHealth.apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        } else {
          uploadHealth.status = 'error';
          uploadHealth.error = 'Cloudinary credentials not configured';
        }
      } catch (error) {
        uploadHealth.status = 'error';
        uploadHealth.error = error.message;
      }

      // System info
      const systemInfo = {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        uptime: process.uptime(),
        memory: {
          total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
          used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
          external: `${Math.round(process.memoryUsage().external / 1024 / 1024)}MB`,
        },
        cpu: process.cpuUsage(),
      };

      const responseTime = Date.now() - startTime;
      const isHealthy =
        dbHealth.status === 'connected' &&
        stellarHealth.status === 'connected' &&
        emailHealth.status === 'configured' &&
        uploadHealth.status === 'configured';

      return {
        status: isHealthy ? 'ok' : 'degraded',
        timestamp: new Date().toISOString(),
        responseTime: `${responseTime}ms`,
        environment: process.env.NODE_ENV || 'development',
        services: {
          database: dbHealth,
          stellar: stellarHealth,
          email: emailHealth,
          upload: uploadHealth,
        },
        system: systemInfo,
      };
    } catch (error) {
      this.logger.error('Detailed health check failed:', error);
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  }
}
