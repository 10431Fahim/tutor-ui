import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UrlRedirectComponent} from './url-redirect.component';

const routes: Routes = [
  {
    path: '',
    component: UrlRedirectComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UrlRedirectRoutingModule { }
