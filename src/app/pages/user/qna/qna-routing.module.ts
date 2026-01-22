import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QnaComponent } from './qna.component';
import { UserAuthGuard } from '../../../auth-guard/user-auth.guard';

const routes: Routes = [
  {
    path: '',
    component: QnaComponent,
    canActivate: [UserAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QnaRoutingModule {}

