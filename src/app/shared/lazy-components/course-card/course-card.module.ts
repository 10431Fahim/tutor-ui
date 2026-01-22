import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseCardComponent } from './course-card.component';
import { PipesModule } from '../../pipes/pipes.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    CourseCardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PipesModule,
    FontAwesomeModule
  ],
  exports:[
    CourseCardComponent,
  ]
})
export class CourseCardModule { }
