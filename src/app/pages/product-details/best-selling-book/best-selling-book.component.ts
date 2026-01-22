import { Component, Input } from '@angular/core';
import { Product } from 'src/app/interfaces/common/product';

@Component({
  selector: 'app-best-selling-book',
  templateUrl: './best-selling-book.component.html',
  styleUrls: ['./best-selling-book.component.scss']
})
export class BestSellingBookComponent {
 @Input() products: Product[];
  constructor() {

  }
  ngOnInit() {

  }

}
