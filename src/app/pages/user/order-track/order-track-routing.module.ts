import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OrderTrackComponent} from "./order-track.component";

const routes: Routes = [
  {
    path:":orderId",
    component:OrderTrackComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderTrackRoutingModule { }
