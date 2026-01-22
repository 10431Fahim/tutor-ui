import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OmrDashboardComponent } from './omr-dashboard.component';
import { OmrScanComponent } from './omr-scan.component';

const routes: Routes = [
  {
    path: '',
    component: OmrDashboardComponent,
  },
  {
    path: 'scan/:examId',
    component: OmrScanComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OmrRoutingModule {}
