import { Component, Input } from '@angular/core';
import { Product } from 'src/app/interfaces/common/product';

@Component({
  selector: 'app-related-product',
  templateUrl: './related-product.component.html',
  styleUrls: ['./related-product.component.scss']
})
export class RelatedProductComponent {
 @Input() products: Product[];


  constructor() {

  }
  ngOnInit() {

  }


}
