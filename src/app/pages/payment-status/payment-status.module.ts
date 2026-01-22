import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PaymentStatusRoutingModule} from './payment-status-routing.module';
import {PaymentStatusComponent} from './payment-status.component';
import {PaymentSuccessComponent} from './payment-success/payment-success.component';
import {PaymentCancelComponent} from './payment-cancel/payment-cancel.component';
import {PaymentFailComponent} from './payment-fail/payment-fail.component'
import {PaymentBkashComponent} from './payment-bkash/payment-bkash.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProductPaymentBkashComponent } from './product-payment-bkash/product-payment-bkash.component';
import { ProductPaymentSuccessComponent } from './product-payment-success/product-payment-success.component';


@NgModule({
  declarations: [
    PaymentStatusComponent,
    PaymentSuccessComponent,
    PaymentCancelComponent,
    PaymentFailComponent,
    PaymentBkashComponent,
    ProductPaymentBkashComponent,
    ProductPaymentSuccessComponent,
  ],
  imports: [
    CommonModule,
    PaymentStatusRoutingModule,
    FontAwesomeModule
  ]
})
export class PaymentStatusModule {
}
