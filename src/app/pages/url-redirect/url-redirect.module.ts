import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UrlRedirectRoutingModule } from './url-redirect-routing.module';
import { UrlRedirectComponent } from './url-redirect.component';


@NgModule({
  declarations: [
    UrlRedirectComponent
  ],
  imports: [
    CommonModule,
    UrlRedirectRoutingModule
  ]
})
export class UrlRedirectModule { }
