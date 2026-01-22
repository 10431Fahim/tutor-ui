import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MyReviewComponent} from './my-review.component';

const routes: Routes = [
  {
    path: "",
    component: MyReviewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyReviewRoutingModule {
}
