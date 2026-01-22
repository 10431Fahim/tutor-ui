import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartialPaymentRoutingModule } from './partial-payment-routing.module';
import { PartialPaymentComponent } from './partial-payment.component';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {PipesModule} from '../../shared/pipes/pipes.module';


@NgModule({
  declarations: [
    PartialPaymentComponent
  ],
  imports: [
    CommonModule,
    PartialPaymentRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    PipesModule,
  ]
})
export class PartialPaymentModule { }
