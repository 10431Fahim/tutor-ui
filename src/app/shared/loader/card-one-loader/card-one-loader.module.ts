import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardOneLoaderComponent } from './card-one-loader.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';



@NgModule({
  declarations: [
    CardOneLoaderComponent
  ],
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule
  ],
  exports:[
    CardOneLoaderComponent
  ]
})
export class CardOneLoaderModule { }
