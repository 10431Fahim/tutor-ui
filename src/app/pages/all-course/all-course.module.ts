import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllCourseRoutingModule } from './all-course-routing.module';
import { AllCourseComponent } from './all-course.component';
import { CourseCardModule } from 'src/app/shared/lazy-components/course-card/course-card.module';
import {ProductCardOneLoaderModule} from '../../shared/loader/product-card-one-loader/product-card-one-loader.module';
import { CourseCategoryLoaderModule } from 'src/app/shared/loader/course-category-loader/course-category-loader.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [AllCourseComponent],
  imports: [
    CommonModule,
    AllCourseRoutingModule,
    CourseCardModule,
    ProductCardOneLoaderModule,
    CourseCategoryLoaderModule,
    FontAwesomeModule
  ],
})
export class AllCourseModule {}
