import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrolledCourseCardComponent } from './enrolled-course-card.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatTooltipModule} from '@angular/material/tooltip';



@NgModule({
  declarations: [
    EnrolledCourseCardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatProgressBarModule,
    MatTooltipModule
  ],
  exports:[
    EnrolledCourseCardComponent
  ]
})
export class EnrolledCourseCardModule { }
