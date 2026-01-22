import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfflineCourseDetailsRoutingModule } from './offline-course-details-routing.module';
import { OfflineCourseDetailsComponent } from './offline-course-details.component';
import {BlogLoaderModule} from "../../shared/loader/blog-loader/blog-loader.module";
import {NgxPaginationModule} from "ngx-pagination";
import {BlogDetailsLoaderModule} from "../../shared/loader/blog-details-loader/blog-details-loader.module";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {PipesModule} from "../../shared/pipes/pipes.module";


@NgModule({
  declarations: [
    OfflineCourseDetailsComponent
  ],
  imports: [
    CommonModule,
    OfflineCourseDetailsRoutingModule,
    BlogLoaderModule,
    NgxPaginationModule,
    BlogDetailsLoaderModule,
    FontAwesomeModule,
    PipesModule,
  ]
})
export class OfflineCourseDetailsModule { }
