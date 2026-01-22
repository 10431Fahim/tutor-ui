import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { BlogLoaderComponent } from './blog-loader.component';



@NgModule({
  declarations: [
   BlogLoaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgxSkeletonLoaderModule
  ],
  exports:[
    BlogLoaderComponent
  ]
})
export class BlogLoaderModule { }
