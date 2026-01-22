import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CourseDetailLoaderLeftComponent } from './course-detail-loader-left.component';

@NgModule({
  declarations: [CourseDetailLoaderLeftComponent],
  imports: [CommonModule, NgxSkeletonLoaderModule],
  exports: [CourseDetailLoaderLeftComponent],
})
export class CourseDetailLoaderLeftModule {}
