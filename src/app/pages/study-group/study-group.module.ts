import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudyGroupComponent } from './study-group.component';
import { StudyGroupRoutingModule } from './study-group-routing.module';
import { MaterialModule } from '../../material/material.module';

@NgModule({
  declarations: [StudyGroupComponent],
  imports: [CommonModule, StudyGroupRoutingModule, MaterialModule],
})
export class StudyGroupModule {}
