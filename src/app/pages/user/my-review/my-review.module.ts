import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyReviewRoutingModule } from './my-review-routing.module';
import { MyReviewComponent } from './my-review.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { ProductCardOneLoaderModule } from '../../../shared/loader/product-card-one-loader/product-card-one-loader.module';
import {MatInputModule} from '@angular/material/input';
import {StarRatingModule} from '../../../shared/lazy-components/star-rating/star-rating.module';
import {FormsModule} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [MyReviewComponent],
  imports: [
    CommonModule,
    MyReviewRoutingModule,
    MatButtonModule,
    MatIconModule,
    ClipboardModule,
    ProductCardOneLoaderModule,
    MatInputModule,
    StarRatingModule,
    FormsModule,
    FontAwesomeModule,
  ],
})
export class MyReviewModule {}
