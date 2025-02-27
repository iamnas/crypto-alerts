import { Controller } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PriceService } from './price.service';

@Controller('price')
export class PriceController {

    constructor(private priceService: PriceService) {}
    @Cron(CronExpression.EVERY_30_SECONDS)
    handleCron() {
        const data = this.priceService.getPrice();
        console.log(data);
        
    }
}
