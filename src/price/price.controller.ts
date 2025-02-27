import { Controller } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PriceService } from './price.service';

@Controller('price')
export class PriceController {

    constructor(private priceService: PriceService ) {}
    @Cron(CronExpression.EVERY_5_MINUTES)
    async handleCron() {
        await this.priceService.fetchAndStorePrices();   
    }

}
