import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { QnaRoutingModule } from './qna-routing.module';
import { QnaComponent } from './qna.component';
import { SharedModule } from '../../../shared/shared.module';
import { MaterialModule } from '../../../material/material.module';

@NgModule({
  declarations: [QnaComponent],
  imports: [
    CommonModule,
    QnaRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    SharedModule,
  ],
})
export class QnaModule {}

