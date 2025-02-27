import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MoralisService } from 'src/moralis/moralis.service';

@Injectable()
export class PriceService {
    private readonly logger = new Logger(PriceService.name);

    constructor(private readonly prisma: PrismaService, private readonly moralisService: MoralisService) { }



    async fetchAndStorePrices() {
        try {
            const ethPrice = await this.moralisService.getPrice('ethereum');
            const maticPrice = await this.moralisService.getPrice('polygon');

            await this.prisma.price.create({
                data: { chain: 'ethereum', price: ethPrice },
            });

            await this.prisma.price.create({
                data: { chain: 'polygon', price: maticPrice },
            });

            this.logger.log(`Saved Prices - ETH: $${ethPrice}, MATIC: $${maticPrice}`);
        } catch (error) {
            this.logger.error('Error fetching prices', error);
        }
    }
}
