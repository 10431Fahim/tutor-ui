import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { BannerComponent } from './banner/banner.component';
import { ProductCardOneModule } from 'src/app/shared/lazy-components/product-card-one/product-card-one.module';
import { SwiperModule } from 'swiper/angular';
import { NgParticlesModule } from "ng-particles";
import { SscHscCourseComponent } from './ssc-hsc-course/ssc-hsc-course.component';
import { ProductCardTwoModule } from 'src/app/shared/lazy-components/product-card-two/product-card-two.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { DeshSheraCoursesComponent } from './desh-shera-courses/desh-shera-courses.component';
import { LectureShitComponent } from './lecture-shit/lecture-shit.component';
import { JoinOurTeamComponent } from './join-our-team/join-our-team.component';
import { CommunityAreaComponent } from './community-area/community-area.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BatchComponent } from './batch/batch.component';
import { CarouselLoaderModule } from '../../shared/loader/carousel-loader/carousel-loader.module';
import { CourseCardModule } from '../../shared/lazy-components/course-card/course-card.module';
import { BatchCardLoaderModule } from '../../shared/loader/batch-card-loader/batch-card-loader.module';
import { ImgCtrlPipe } from '../../shared/pipes/img-ctrl.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatMenuModule} from '@angular/material/menu';
import {LiveCourseComponent} from './live-course/live-course.component';
import {FeaturedCategoryComponent} from './featured-category/featured-category.component';
import { UpcomingDialogModule } from 'src/app/shared/dialog-view/upcoming-dialog/upcoming-dialog.module';
import {TagProductsComponent} from "./tag-products/tag-products.component";
import { MaterialModule } from '../../material/material.module';

@NgModule({
  declarations: [
    HomeComponent,
    BannerComponent,
    SscHscCourseComponent,
    FeaturedCategoryComponent,
    LiveCourseComponent,
    DeshSheraCoursesComponent,
    LectureShitComponent,
    JoinOurTeamComponent,
    CommunityAreaComponent,
    ContactUsComponent,
    BatchComponent,
  ],
    imports: [
        CommonModule,
        HomeRoutingModule,
        ProductCardOneModule,
        SwiperModule,
        NgParticlesModule,
        ProductCardTwoModule,
        PipesModule,
        FormsModule,
        ReactiveFormsModule,
        CarouselLoaderModule,
        CourseCardModule,
        BatchCardLoaderModule,
        UpcomingDialogModule,
        NgOptimizedImage,
        ImgCtrlPipe,
        FontAwesomeModule,
        MatMenuModule,
        TagProductsComponent,
        MaterialModule,
    ],
})
export class HomeModule {}
