import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamModuleComponent } from './exam-module.component';

const routes: Routes = [
  {
    path: '',
    component: ExamModuleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamModuleRoutingModule { }
