import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselLoaderComponent } from './carousel-loader.component';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';



@NgModule({
  declarations: [
    CarouselLoaderComponent
  ],
  exports: [
    CarouselLoaderComponent
  ],
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule
  ]
})
export class CarouselLoaderModule { }
