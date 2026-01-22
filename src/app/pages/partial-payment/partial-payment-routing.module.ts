import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PartialPaymentComponent} from './partial-payment.component';

const routes: Routes = [
  {path: ':id', component: PartialPaymentComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartialPaymentRoutingModule { }
