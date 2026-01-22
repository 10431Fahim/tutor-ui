import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignmentComponent } from './assignment.component';
import { UserAuthGuard } from '../../../auth-guard/user-auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AssignmentComponent,
    canActivate: [UserAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignmentRoutingModule {}



