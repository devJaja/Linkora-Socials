import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { SendXlmDto } from './dto/send-xlm.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balance')
  async getBalance(@Request() req) {
    return this.walletService.getBalance(req.user.userId);
  }
  @Get('seeker-balance')
  async getSeekerBalance(@Request() req) {
    return this.walletService.getSeekerBalance(req.user.userId);
  }

  @Get('transactions')
  async getTransactions(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.walletService.getTransactions(
      req.user.userId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }

  @Post('send')
  async sendXlm(@Request() req, @Body() sendXlmDto: SendXlmDto) {
    return this.walletService.sendXlm(req.user.userId, sendXlmDto);
  }

  @Post('send-to-user')
  async sendXlmToUser(
    @Request() req,
    @Body() body: { username: string; amount: number; memo?: string },
  ) {
    return this.walletService.sendXlmToUser(
      req.user.userId,
      body.username,
      body.amount,
      body.memo,
    );
  }

  @Get('transactions/:signature')
  async getTransactionDetails(
    @Request() req,
    @Param('signature') signature: string,
  ) {
    return this.walletService.getTransactionDetails(req.user.userId, signature);
  }
}
