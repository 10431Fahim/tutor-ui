import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyCertificateRoutingModule } from './my-certificate-routing.module';
import { MyCertificateComponent } from './my-certificate.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatProgressBarModule} from "@angular/material/progress-bar";


@NgModule({
  declarations: [
    MyCertificateComponent
  ],
  imports: [
    CommonModule,
    MyCertificateRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ]
})
export class MyCertificateModule { }
