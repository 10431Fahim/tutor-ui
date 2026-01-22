import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PaymentStatusComponent} from './payment-status.component';
import {PaymentSuccessComponent} from './payment-success/payment-success.component';
import {PaymentCancelComponent} from './payment-cancel/payment-cancel.component';
import {PaymentFailComponent} from './payment-fail/payment-fail.component';
import {PaymentBkashComponent} from './payment-bkash/payment-bkash.component';
import {ProductPaymentBkashComponent} from "./product-payment-bkash/product-payment-bkash.component";
import {ProductPaymentSuccessComponent} from "./product-payment-success/product-payment-success.component";

const routes: Routes = [
  {
    path: '',
    component: PaymentStatusComponent,
    children: [
      {path: '', redirectTo: 'success', pathMatch: 'full'},
      {path: 'success', component: PaymentSuccessComponent},
      {path: 'payment-success', component: ProductPaymentSuccessComponent},
      {path: 'cancel', component: PaymentCancelComponent},
      {path: 'fail', component: PaymentFailComponent},
      {path: 'check-bkash-payment', component: PaymentBkashComponent},
      {path: 'check-bkash-product-payment', component: ProductPaymentBkashComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentStatusRoutingModule { }
