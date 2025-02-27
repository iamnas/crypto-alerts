import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Moralis from 'moralis';

@Injectable()
export class MoralisService implements OnModuleInit {
    private readonly logger = new Logger(MoralisService.name);
    constructor(private configService: ConfigService) {}
    async onModuleInit() {
        if (!Moralis.Core.isStarted) {
            await Moralis.start({ apiKey: this.configService.get('MORALIS_API')});
            this.logger.log('Moralis Initialized');
        }
    }

    async getPrice(chain: string): Promise<number> {
        try {
            const response = await Moralis.EvmApi.token.getTokenPrice({
                address: chain === 'ethereum' ? this.configService.get('WETH') : this.configService.get('WMATIC'),
                chain: chain === 'ethereum' ? '0x1' : '0x89',
            });

            return response.result.usdPrice || 0;
        } catch (error) {
            this.logger.error(`Error fetching ${chain} price`, error);
            return 0;
        }
    }


}
