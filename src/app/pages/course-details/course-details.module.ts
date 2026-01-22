import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SwiperModule } from 'swiper/angular';
import { CourseDetailLoaderLeftModule } from './../../shared/loader/course-detail-loader-left/course-detail-loader-left.module';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CourseCardModule } from 'src/app/shared/lazy-components/course-card/course-card.module';
import { CourseDetailLoaderRightModule } from 'src/app/shared/loader/course-detail-loader-right/course-detail-loader-right.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { UpcomingModule } from '../../shared/dialog-view/upcoming/upcoming.module';
import { VideoPlayerDialogModule } from '../../shared/dialog-view/video-player-dialog/video-player-dialog.module';
import { CourseDetailsRoutingModule } from './course-details-routing.module';
import { CourseDetailsComponent } from './course-details.component';
import { CourseReviewComponent } from './course-review/course-review.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CourseRatingReviewComponent } from './course-rating-review/course-rating-review.component';
import { FaqComponent } from './faq/faq.component';
import {ConfirmDialogComponent} from "./confirm-dialog/confirm-dialog.component";

@NgModule({
  declarations: [CourseDetailsComponent, CourseReviewComponent, CourseRatingReviewComponent, FaqComponent, ConfirmDialogComponent],
  imports: [
    CommonModule,
    CourseDetailsRoutingModule,
    SwiperModule,
    CourseCardModule,
    MatIconModule,
    MatExpansionModule,
    MatButtonModule,
    PipesModule,
    VideoPlayerDialogModule,
    UpcomingModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    CourseDetailLoaderLeftModule,
    CourseDetailLoaderRightModule,
    FontAwesomeModule
  ],
})
export class CourseDetailsModule {}
