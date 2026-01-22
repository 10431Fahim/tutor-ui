import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NoticeDetailsComponent} from "./notice-details/notice-details.component";
import {AllNoticeComponent} from "./all-notice.component";

const routes: Routes = [
  {
    path:"",
    component:AllNoticeComponent
  },
  {
    path:"notice-details/:id",
    component:NoticeDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllNoticeRoutingModule { }
