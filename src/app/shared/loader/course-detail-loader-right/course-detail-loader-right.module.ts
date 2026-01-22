import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CourseDetailLoaderRightComponent } from './course-detail-loader-right.component';

@NgModule({
  declarations: [CourseDetailLoaderRightComponent],
  imports: [CommonModule, NgxSkeletonLoaderModule],
  exports: [CourseDetailLoaderRightComponent],
})
export class CourseDetailLoaderRightModule {}
