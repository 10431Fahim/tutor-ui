import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {QuizComponent} from './quiz.component';
import {QuizDetailsComponent} from './quiz-details/quiz-details.component';

const routes: Routes = [
  {
    path: ':id',
    component: QuizComponent,
  },
  {
    path: 'quiz-details/:id',
    component: QuizDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuizRoutingModule {
}
