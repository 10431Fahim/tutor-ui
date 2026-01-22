import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyEnrollRoutingModule } from './my-enroll-routing.module';
import { MyEnrollComponent } from './my-enroll.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { ProductCardOneLoaderModule } from '../../../shared/loader/product-card-one-loader/product-card-one-loader.module';
import {MatDialogModule} from '@angular/material/dialog';


@NgModule({
  declarations: [
    MyEnrollComponent
  ],
  imports: [
    CommonModule,
    MyEnrollRoutingModule,
    MatButtonModule,
    MatIconModule,
    ClipboardModule,
    ProductCardOneLoaderModule,
    FontAwesomeModule,
    MatDialogModule,
  ]
})
export class MyEnrollModule { }
