import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderTrackRoutingModule } from './order-track-routing.module';
import { OrderTrackComponent } from './order-track.component';
import {PipesModule} from "../../../shared/pipes/pipes.module";


@NgModule({
  declarations: [
    OrderTrackComponent
  ],
  imports: [
    CommonModule,
    OrderTrackRoutingModule,
    PipesModule
  ]
})
export class OrderTrackModule { }
