import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GeneralDashboardComponent } from './general-dashboard.component';
import { GeneralDashboardRoutingModule } from './general-dashboard-routing.module';
import { PipesModule } from '../../../shared/pipes/pipes.module';

@NgModule({
  declarations: [GeneralDashboardComponent],
  imports: [
    CommonModule,
    GeneralDashboardRoutingModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    PipesModule,
  ],
})
export class GeneralDashboardModule {}
