import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutineComponent } from './routine.component';

const routes: Routes = [
  { path: '', component: RoutineComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutineRoutingModule {}
