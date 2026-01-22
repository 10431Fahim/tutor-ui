import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardOneComponent } from './product-card-one.component';
import { RouterModule } from '@angular/router';
import { PipesModule } from '../../pipes/pipes.module';
import {MatIconModule} from "@angular/material/icon";
import {MaterialModule} from "../../../material/material.module";



@NgModule({
    declarations: [
        ProductCardOneComponent
    ],
    exports: [
        ProductCardOneComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        PipesModule,
      MatIconModule,
      MaterialModule,
    ]
})
export class ProductCardOneModule { }
