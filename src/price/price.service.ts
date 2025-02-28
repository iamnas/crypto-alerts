import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MoralisService } from 'src/moralis/moralis.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class PriceService {
    private readonly logger = new Logger(PriceService.name);

    constructor(private readonly prisma: PrismaService, private readonly moralisService: MoralisService, private emailService: EmailService) { }

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

    async getHourlyPrices(chain: string) {
        return this.prisma.price.findMany({
            where: { chain },
            orderBy: { timestamp: 'desc' },
            take: 24,
        });
    }

    async getPrice(ethAmount: string) {
        const btcRate = await this.fetchRate('ETH', 'BTC');

        const btcAmount = Number(ethAmount) * btcRate;
        const feePercentage = 0.03;
        const feeEth = Number(ethAmount) * feePercentage;
        const feeUsd = feeEth * (await this.fetchRate('ETH', 'USD'));

        return {
            btcAmount,
            totalFee: {
                eth: feeEth,
                usd: feeUsd,
            },
        };
    }

    private async fetchRate(from: string, to: string): Promise<number> {

        const apiUrl = 'https://min-api.cryptocompare.com/data/price';
        const response = await fetch(`${apiUrl}?fsym=${from}&tsyms=${to}`);
        const data = await response.json();
        return data[to];
    }

    async setPriceAlert(body: { chain: string; dollar: number; email: string }) {
        const { chain, dollar, email } = body;

        await this.prisma.alert.create({
            data: {
                chain: chain,
                targetPrice: dollar,
                email: email,
            },
        });

        this.logger.log(`Alert set for ${chain} at $${dollar} for ${email}`);
        return { message: `Alert set for ${chain} at $${dollar}` };

    }

    async checkAndSendAlerts() {
        const alerts = await this.prisma.alert.findMany({
            where: { isTriggered: false },
        });

        if (alerts?.length === 0) {
            return; // No alerts to process
        }

        for (const alert of alerts) {
            const currentPrice = await this.moralisService.getPrice(alert.chain);

            if (currentPrice >= Number(alert.targetPrice)) {
                await this.emailService.sendAlert(alert.chain, Number(alert.targetPrice), alert.email);

                await this.prisma.alert.update({
                    where: { id: alert.id },
                    data: { isTriggered: true },
                });
            }
        }
    }

}
