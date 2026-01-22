import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MyProductReviewComponent} from "./my-product-review.component";

const routes: Routes = [
  {
    path: '',
    component: MyProductReviewComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyProductReviewRoutingModule { }
