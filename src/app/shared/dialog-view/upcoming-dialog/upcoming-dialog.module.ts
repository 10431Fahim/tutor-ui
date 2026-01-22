import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpcomingDialogComponent } from './upcoming-dialog.component';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {RouterModule} from '@angular/router';
import { PipesModule } from '../../pipes/pipes.module';



@NgModule({
  declarations: [
    UpcomingDialogComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    RouterModule,
    PipesModule,
  ]
})
export class UpcomingDialogModule { }
