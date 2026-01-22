import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { ProductCardOneComponent } from './product-card-one.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { PipesModule } from '../../pipes/pipes.module';
import {ImgCtrlPipe} from '../../pipes/img-ctrl.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [
    ProductCardOneComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    PipesModule,
    ImgCtrlPipe,
    NgOptimizedImage,
    FontAwesomeModule
  ],
  exports:[
    ProductCardOneComponent
  ]
})
export class ProductCardOneModule { }
