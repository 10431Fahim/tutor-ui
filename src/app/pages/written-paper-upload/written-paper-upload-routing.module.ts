import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WrittenPaperUploadComponent } from './written-paper-upload.component';
import { UserAuthGuard } from '../../auth-guard/user-auth.guard';

const routes: Routes = [
  { 
    path: '', 
    component: WrittenPaperUploadComponent,
    canActivate: [UserAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WrittenPaperUploadRoutingModule {}
