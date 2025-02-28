import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PriceService } from './price/price.service';
import { ScheduleModule } from '@nestjs/schedule';
import { PriceController } from './price/price.controller';
import { MoralisService } from './moralis/moralis.service';
import { EmailService } from './email/email.service';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [ScheduleModule.forRoot(),ConfigModule.forRoot({isGlobal: true,})],
  controllers: [AppController, PriceController],
  providers: [AppService, PrismaService, PriceService, MoralisService, EmailService],
})
export class AppModule {}
