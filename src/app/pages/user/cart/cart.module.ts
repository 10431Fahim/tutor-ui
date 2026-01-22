import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart.component';
import { RelatedProductsComponent } from './related-products/related-products.component';
import { SwiperModule } from 'swiper/angular';
import { MaterialModule } from 'src/app/material/material.module';
import { ProductCardTwoModule } from 'src/app/shared/components/product-card-two/product-card-two.module';
import { CartInformationComponent } from './cart-information/cart-information.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';


@NgModule({
  declarations: [
    CartComponent,
    RelatedProductsComponent,
    CartInformationComponent
  ],
  imports: [
    CommonModule,
    CartRoutingModule,
    SwiperModule,
    MaterialModule,
    ProductCardTwoModule,
    PipesModule,
  ]
})
export class CartModule { }
