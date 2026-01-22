import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfCourseCardComponent } from './pdf-course-card.component';
import {RouterModule} from "@angular/router";
import {PipesModule} from "../../pipes/pipes.module";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    PdfCourseCardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PipesModule,
    FontAwesomeModule
  ],
  exports:[
    PdfCourseCardComponent,
  ]
})
export class PdfCourseCardModule { }
