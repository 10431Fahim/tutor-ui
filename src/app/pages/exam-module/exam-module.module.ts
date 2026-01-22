import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamModuleRoutingModule } from './exam-module-routing.module';
import { ExamModuleComponent } from './exam-module.component';

@NgModule({
  declarations: [ExamModuleComponent],
  imports: [
    CommonModule,
    ExamModuleRoutingModule
  ]
})
export class ExamModuleModule { }
