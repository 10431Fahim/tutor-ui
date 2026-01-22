import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatSliderModule } from '@angular/material/slider';
import { MaterialModule } from 'src/app/material/material.module';
import { ProductListRoutingModule } from './product-list-routing.module';
import { ProductListComponent } from './product-list.component';
import { ProductsComponent } from './products/products.component';
import {ProductCardOneModule} from "../../shared/components/product-card-one/product-card-one.module";
import {PosterCardOneModule} from "../../shared/components/poster-card-one/poster-card-one.module";
import { NgxPaginationModule } from 'ngx-pagination';
import {CardOneLoaderModule} from "../../shared/loader/card-one-loader/card-one-loader.module";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  declarations: [
    ProductListComponent,
    ProductsComponent
  ],
  imports: [
    CommonModule,
    ProductListRoutingModule,
    MaterialModule,
    MatSliderModule,
    ProductCardOneModule,
    PosterCardOneModule,
    NgxPaginationModule,
    CardOneLoaderModule,
    FontAwesomeModule,
    FormsModule,
    SharedModule,
  ]
})
export class ProductListModule { }
