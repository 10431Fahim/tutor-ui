import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CourseCategoryLoaderComponent } from './course-category-loader.component';

@NgModule({
  declarations: [CourseCategoryLoaderComponent],
  imports: [CommonModule, NgxSkeletonLoaderModule],
  exports: [CourseCategoryLoaderComponent],
})
export class CourseCategoryLoaderModule {}
