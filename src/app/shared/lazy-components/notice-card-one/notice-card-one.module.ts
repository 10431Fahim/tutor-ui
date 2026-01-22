import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoticeCardOneComponent } from './notice-card-one.component';
import {RouterModule} from "@angular/router";



@NgModule({
  declarations: [
    NoticeCardOneComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    NoticeCardOneComponent
  ]
})
export class NoticeCardOneModule { }
