import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogDetailsLoaderComponent } from './blog-details-loader.component';
import { RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';



@NgModule({
  declarations: [
    BlogDetailsLoaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgxSkeletonLoaderModule
  ],
  exports:[
    BlogDetailsLoaderComponent
  ]
})
export class BlogDetailsLoaderModule { }
