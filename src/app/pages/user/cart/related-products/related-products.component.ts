import {Component} from '@angular/core';
import {Subscription} from 'rxjs';
import {Product} from 'src/app/interfaces/common/product';
import {ProductService} from 'src/app/services/common/product.service';
import {FilterData} from "../../../../interfaces/core/filter-data.interface";

@Component({
  selector: 'app-related-products',
  templateUrl: './related-products.component.html',
  styleUrls: ['./related-products.component.scss']
})
export class RelatedProductsComponent {
//Store Data
products: Product[];
endPoint: number;
//Subscription
private subDataOne: Subscription;

constructor(
  private productService: ProductService
) {

}

ngOnInit(): void {
  //Get Base Data
  this.getAllRelatedProduct();
}

/**
* HTTP REQUEST HANDLE
* getAllRelatedProduct()
*/

private getAllRelatedProduct() {
  const mSelect = {
    name: 1,
    images: 1,
    author: 1,
    salePrice: 1,
    costPrice: 1,
  }

  const filterData: FilterData = {
    filter: null,
    sort: { createdAt: -1 },
    pagination: null,
    select: mSelect
  }

  this.subDataOne = this.productService.getAllProducts(filterData).subscribe(
    (res) => {
      if (res.success) {
        this.products = res.data;
        this.generateRandomNumber();
      }
    },
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  )
}


/**
 * RANDOMLY HANDLE PRODUCT
 * generateRandomNumber()
 */
  generateRandomNumber() {
    this.endPoint = Math.round(Math.random() * this.products.length);
  }

//Destory subscription
ngOnDestroy(): void {
  if (this.subDataOne) {
    this.subDataOne.unsubscribe();
  }
}
}
