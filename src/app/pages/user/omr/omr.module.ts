import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { OmrDashboardComponent } from './omr-dashboard.component';
import { OmrScanComponent } from './omr-scan.component';
import { OmrRoutingModule } from './omr-routing.module';

@NgModule({
  declarations: [OmrDashboardComponent, OmrScanComponent],
  imports: [
    CommonModule,
    OmrRoutingModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
})
export class OmrModule {}
