import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MyCertificateComponent} from "./my-certificate.component";

const routes: Routes = [
  {path: '', component: MyCertificateComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyCertificateRoutingModule {
}
