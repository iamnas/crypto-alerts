import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PriceService } from './price.service';
import { EmailService } from 'src/email/email.service';

@Controller('price')
export class PriceController {

    constructor(private priceService: PriceService, private emailService: EmailService) { }
    @Cron(CronExpression.EVERY_5_MINUTES)
    async handleCron() {
        await this.priceService.fetchAndStorePrices();
    }

    @Cron(CronExpression.EVERY_HOUR) 
    async checkPriceAndSendAlerts() {
        await this.emailService.checkPriceAndSendAlerts();
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async checkAndSendAlerts() {
      await this.priceService.checkAndSendAlerts();
    }

    @Get('/hourly')
    async getHourlyPrices(@Query('chain') chain: string) {
        return await this.priceService.getHourlyPrices(chain);
    }

    @Post('/set-alert')
    async setPriceAlert(@Body() body: { chain: string; dollar: number; email: string }) {
        return await this.priceService.setPriceAlert(body);
    }

    @Get('/eth-to-btc')
    async getSwapRate(@Query('ethAmount') ethAmount: string) {
        return this.priceService.getPrice(ethAmount);
    }

}
