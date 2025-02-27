import { Injectable } from '@nestjs/common';



@Injectable()
export class PriceService {


    getPrice(): string {
        return 'Hello World!';
    }
 
}
