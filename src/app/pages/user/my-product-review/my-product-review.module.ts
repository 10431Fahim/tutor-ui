import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyProductReviewRoutingModule } from './my-product-review-routing.module';
import { MyProductReviewComponent } from './my-product-review.component';
import {PipesModule} from "../../../shared/pipes/pipes.module";


@NgModule({
  declarations: [
    MyProductReviewComponent
  ],
  imports: [
    CommonModule,
    MyProductReviewRoutingModule,
    PipesModule,
  ]
})
export class MyProductReviewModule { }
