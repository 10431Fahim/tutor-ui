import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { FooterComponent } from './footer.component';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {ImgCtrlPipe} from "../../pipes/img-ctrl.pipe";



@NgModule({
  declarations: [
    FooterComponent
  ],
    imports: [
        CommonModule,
        RouterModule,
        NgOptimizedImage,
        FontAwesomeModule,
        ImgCtrlPipe
    ],
  exports:[
    FooterComponent
  ]
})
export class FooterModule { }
