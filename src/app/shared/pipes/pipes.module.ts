import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NumberMinDigitPipe} from './number-min-digit.pipe';
import {PricePipe} from './price.pipe';
import {EngBnNumPipe} from './eng-bn-num.pipe';
import {SafeHtmlCustomPipe} from './safe-html.pipe';
import {FilterPipe} from './filter.pipe';
import {SafeUrlPipe} from "./safe-url.pipe";
import {SecToTimePipe} from './sec-to-time.pipe';
import {PricesPipe} from "./prices.pipe";
import {OrderStatusPipe} from "./order-status.pipe";


@NgModule({
  declarations: [
    NumberMinDigitPipe,
    PricePipe,
    EngBnNumPipe,
    SafeHtmlCustomPipe,
    FilterPipe,
    SafeUrlPipe,
    SecToTimePipe,
    PricesPipe,
    OrderStatusPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NumberMinDigitPipe,
    PricePipe,
    EngBnNumPipe,
    SafeHtmlCustomPipe,
    FilterPipe,
    SafeUrlPipe,
    SecToTimePipe,
    PricesPipe,
    OrderStatusPipe
  ]
})
export class PipesModule {
}
