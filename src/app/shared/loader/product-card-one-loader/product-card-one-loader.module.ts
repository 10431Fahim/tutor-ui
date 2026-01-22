import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardOneLoaderComponent } from './product-card-one-loader.component';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';

@NgModule({
  declarations: [
    ProductCardOneLoaderComponent
  ],
  exports: [
    ProductCardOneLoaderComponent
  ],
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule
  ]
})
export class ProductCardOneLoaderModule { }
