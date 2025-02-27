import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PriceService } from './price/price.service';
import { ScheduleModule } from '@nestjs/schedule';
import { PriceController } from './price/price.controller';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [AppController, PriceController],
  providers: [AppService, PrismaService, PriceService],
})
export class AppModule {}
