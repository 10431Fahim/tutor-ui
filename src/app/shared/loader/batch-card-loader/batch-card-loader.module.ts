import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchCardLoaderComponent } from './batch-card-loader.component';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';

@NgModule({
  declarations: [
    BatchCardLoaderComponent
  ],
  exports: [
    BatchCardLoaderComponent
  ],
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule
  ]
})
export class BatchCardLoaderModule { }
