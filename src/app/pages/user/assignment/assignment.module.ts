import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssignmentRoutingModule } from './assignment-routing.module';
import { AssignmentComponent } from './assignment.component';

@NgModule({
  declarations: [AssignmentComponent],
  imports: [
    CommonModule,
    FormsModule,
    AssignmentRoutingModule,
  ],
})
export class AssignmentModule {}



