import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {QuizResultComponent} from './quiz-result.component';

const routes: Routes = [
  {
    path:'',
    component:QuizResultComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuizResultRoutingModule { }
