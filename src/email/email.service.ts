import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);

    constructor(private readonly prisma: PrismaService) { }

    async checkPriceAndSendAlerts() {
        const oneHourAgo = new Date();
        oneHourAgo.setHours(oneHourAgo.getHours() - 1);

        const chains = ['ethereum', 'polygon'];

        for (const chain of chains) {
            const latestPrice = await this.prisma.price.findFirst({
                where: { chain },
                orderBy: { timestamp: 'desc' },
            });

            const oldPrice = await this.prisma.price.findFirst({
                where: { chain, timestamp: { lt: oneHourAgo } },
                orderBy: { timestamp: 'desc' },
            });

            if (latestPrice && oldPrice) {
                const percentageChange = ((Number(latestPrice.price) - Number(oldPrice.price)) / Number(oldPrice.price)) * 100;
                if (percentageChange > 3) {
                    await this.sendEmail(chain, Number(latestPrice.price), percentageChange);
                }
            }
        }
    }


    private async sendEmail(chain: string, price: number, percentageChange: number) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.TZ_EMAIL,
            subject: `🚨 ${chain.toUpperCase()} Price Alert!`,
            text: `The price of ${chain} increased by ${percentageChange.toFixed(2)}% and is now $${price}.`,
        };

        await transporter.sendMail(mailOptions);
        this.logger.log(`Email sent for ${chain}: New Price - $${price}`);
    }


    async sendAlert(chain: string, price: number, email: string) {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: `🚨 Price Alert for ${chain.toUpperCase()}!`,
          text: `The price of ${chain} has reached $${price}.`,
        };
    
        await transporter.sendMail(mailOptions);
        this.logger.log(`Email sent to ${email} for ${chain} at $${price}`);
      }

    

}
