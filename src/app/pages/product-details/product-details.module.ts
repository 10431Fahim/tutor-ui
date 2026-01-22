import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SwiperModule } from 'swiper/angular';
import { ProductDetailsRoutingModule } from './product-details-routing.module';
import { ProductDetailsComponent } from './product-details.component';
import { DescriptionComponent } from './description/description.component';
import { ProductDetailsAreaComponent } from './product-details-area/product-details-area.component';
import { RelatedProductComponent } from './related-product/related-product.component';
import { BestSellingBookComponent } from './best-selling-book/best-selling-book.component';
import { ProductCardTwoModule } from 'src/app/shared/components/product-card-two/product-card-two.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { RatingAndReviewComponent } from './rating-and-review/rating-and-review.component';
import { AllReviewsComponent } from './all-reviews/all-reviews.component';
import {StarRatingModule} from "../../shared/lazy-components/star-rating/star-rating.module";
import {MaterialModule} from "../../material/material.module";
// import { NgxDropzoneModule } from 'ngx-dropzone';
// import { StarRatingModule } from 'src/app/shared/components/star-rating/star-rating.module';


@NgModule({
  declarations: [
    ProductDetailsComponent,
    DescriptionComponent,
    ProductDetailsAreaComponent,
    RelatedProductComponent,
    BestSellingBookComponent,
    RatingAndReviewComponent,
    AllReviewsComponent
  ],
  imports: [
    CommonModule,
    ProductDetailsRoutingModule,
    SwiperModule,
    ProductCardTwoModule,
    MaterialModule,
    PipesModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    StarRatingModule
  ]
})
export class ProductDetailsModule { }
