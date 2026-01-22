import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OfflineCourseDetailsComponent} from "./offline-course-details.component";

const routes: Routes = [
  {
    path:"",
    component:OfflineCourseDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfflineCourseDetailsRoutingModule { }
