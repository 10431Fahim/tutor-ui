import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderDetailsRoutingModule } from './order-details-routing.module';
import { OrderDetailsComponent } from './order-details.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import {RatingAndReviewComponent} from "./rating-and-review/rating-and-review.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {StarRatingModule} from "../../../shared/lazy-components/star-rating/star-rating.module";
import {MaterialModule} from "../../../material/material.module";


@NgModule({
  declarations: [
    OrderDetailsComponent,
    RatingAndReviewComponent
  ],
  imports: [
    CommonModule,
    OrderDetailsRoutingModule,
    PipesModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    StarRatingModule,
  ]
})
export class OrderDetailsModule { }
