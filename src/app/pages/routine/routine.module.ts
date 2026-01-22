import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutineComponent } from './routine.component';
import { RoutineRoutingModule } from './routine-routing.module';
import { MaterialModule } from '../../material/material.module';

@NgModule({
  declarations: [RoutineComponent],
  imports: [CommonModule, RoutineRoutingModule, MaterialModule],
})
export class RoutineModule {}
