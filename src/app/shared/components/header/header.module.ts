 import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { HeaderComponent } from './header.component';
import { RouterModule } from '@angular/router';
import { SlideMenuComponent } from './slide-menu/slide-menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../../pipes/pipes.module';
import { ImgCtrlPipe } from '../../pipes/img-ctrl.pipe';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {CartSlideComponent} from "./cart-slide/cart-slide.component";
import {MaterialModule} from "../../../material/material.module";


@NgModule({
  declarations: [
    HeaderComponent,
    SlideMenuComponent,
    CartSlideComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    PipesModule,
    MaterialModule,
    NgOptimizedImage,
    ImgCtrlPipe,
    FontAwesomeModule
  ],
  exports:[
    HeaderComponent
  ]
})
export class HeaderModule { }
