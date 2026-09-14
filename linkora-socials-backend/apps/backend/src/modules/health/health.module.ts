import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { StellarModule } from '../stellar/stellar.module';
import { EmailModule } from '../email/email.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [StellarModule, EmailModule, UploadModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
