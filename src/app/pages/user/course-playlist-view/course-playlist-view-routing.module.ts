import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CoursePlaylistViewComponent} from './course-playlist-view.component';

const routes: Routes = [
  {path: ':id', component: CoursePlaylistViewComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursePlaylistViewRoutingModule { }
