import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpcomingComponent } from './upcoming.component';
import {MatDialogModule} from '@angular/material/dialog';
import {RouterModule} from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [
    UpcomingComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    RouterModule,
    FontAwesomeModule
  ]
})
export class UpcomingModule { }
