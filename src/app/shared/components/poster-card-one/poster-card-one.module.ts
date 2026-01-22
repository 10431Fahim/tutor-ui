import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PosterCardOneComponent } from './poster-card-one.component';
import {RouterLink} from "@angular/router";
import {PipesModule} from "../../pipes/pipes.module";



@NgModule({
  declarations: [
    PosterCardOneComponent
  ],
    imports: [
        CommonModule,
        RouterLink,
        PipesModule
    ],
  exports:[
    PosterCardOneComponent
  ]

})
export class PosterCardOneModule { }
