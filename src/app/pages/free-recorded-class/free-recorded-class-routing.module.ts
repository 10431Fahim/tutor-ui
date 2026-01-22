import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FreeRecordedClassComponent } from './free-recorded-class.component';

const routes: Routes = [
  { path: '', component: FreeRecordedClassComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FreeRecordedClassRoutingModule {}
