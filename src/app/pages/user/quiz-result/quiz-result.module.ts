import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuizResultRoutingModule } from './quiz-result-routing.module';
import { QuizResultComponent } from './quiz-result.component';
import {PipesModule} from '../../../shared/pipes/pipes.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    QuizResultComponent
  ],
  imports: [
    CommonModule,
    QuizResultRoutingModule,
     PipesModule, FontAwesomeModule
  ]
})
export class QuizResultModule { }
