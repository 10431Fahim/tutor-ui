import {Component, OnDestroy, OnInit} from '@angular/core';
import {CartService} from 'src/app/services/common/cart.service';
import {ProductService} from 'src/app/services/common/product.service';
import {ReloadService} from 'src/app/services/core/reload.service';
import {Subscription} from 'rxjs';
import {DATABASE_KEY} from 'src/app/core/utils/global-variable';
import {UserDataService} from 'src/app/services/common/user-data.service';
import {UserService} from 'src/app/services/common/user.service';
import {UiService} from 'src/app/services/core/ui.service';
import {Product} from "../../../../interfaces/common/product";
import {PricesPipe} from "../../../pipes/prices.pipe";

@Component({
  selector: 'app-cart-slide',
  templateUrl: './cart-slide.component.html',
  styleUrls: ['./cart-slide.component.scss'],
  providers: [PricesPipe],
})
export class CartSlideComponent implements OnInit, OnDestroy {
  //Store Data
  cartSlide: boolean = false;
  carts: any[] = [];

  // Subscriptions
  private subReloadCart: Subscription;
  private subDataOne: Subscription;
  private subUpdateCartData: Subscription;
  private subDeleteCartData: Subscription;


  constructor(
    private productService: ProductService,
    public userService: UserService,
    public userDataService: UserDataService,
    private cartService: CartService,
    private reloadService: ReloadService,
    private uiService: UiService,
    private pricePipe: PricesPipe,
  ) { }

  ngOnInit(): void {
    this.subReloadCart = this.reloadService.refreshCart$.subscribe((res) => {
      this.getCartsItems(res);
    });
    this.getCartsItems();
  }

  /**
   * HTTP REQ HANDLE
   * getLoggedInUserData()
   * getCartsItems()
   * updateCartQty()
   * deleteCartById()
   */
  private getCartsItems(refresh?: boolean) {
    if (this.userService.getUserStatus()) {
      this.subDataOne = this.cartService.getCartByUser().subscribe((res) => {
        this.carts = res.data;
        this.cartService.updateCartList(this.carts);
      });
    } else {
      this.getCarsItemFromLocal(refresh);
    }
  }

  private updateCartQty(cartId: string, data: any) {
    this.subUpdateCartData = this.cartService.updateCartQty(cartId, data).subscribe(
      () => {
        this.reloadService.needRefreshCart$();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  deleteCartById(cartId: string) {
    this.subDeleteCartData = this.cartService.deleteCartById(cartId).subscribe(
      () => {
        this.reloadService.needRefreshCart$(true);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private getCarsItemFromLocal(refresh?: boolean) {
    const items = this.cartService.getCartItemFromLocalStorage();
    if (items && items.length > 0) {
      const ids: string[] = items.map((m) => m.product as string);
      const select =
        'name salePrice sku discountType discountAmount images quantity category subCategory brand tags';
      this.productService.getProductByIds(ids, select).subscribe((res) => {
        const products = res.data;
        if (products && products.length > 0) {
          this.carts = items.map((t1) => ({
            ...t1,
            ...{ product: products.find((t2) => t2._id === t1.product) },
          }));
          this.cartService.updateCartList(this.carts);
        }
      });
    } else {
      this.carts = [];
      this.cartService.updateCartList(this.carts);
    }
  }


  /**
     * LOGICAL METHODS
     * onIncrementQty()
     * onDecrementQty()
     * onDeleteCartItem()
     */

  onIncrementQty(cartId: string, index: number) {
    if (this.userService.getUserStatus()) {
      this.updateCartQty(cartId, { selectedQty: 1, type: 'increment' });
    } else {
      const data = this.cartService.getCartItemFromLocalStorage();
      if (data != null) {
        data[index].selectedQty = data[index].selectedQty + 1;
        localStorage.setItem(DATABASE_KEY.userCart, JSON.stringify(data));
        this.reloadService.needRefreshCart$();
      }
    }
  }

  onDecrementQty(cartId: string, index: number, sQty: number) {
    if (this.userService.getUserStatus()) {
      if (sQty === 1) {
        this.uiService.warn('Minimum quantity is 1');
        return;
      }
      this.updateCartQty(cartId, { selectedQty: 1, type: 'decrement' });
    } else {
      const data = this.cartService.getCartItemFromLocalStorage();
      if (data[index].selectedQty === 1) {
        return;
      }
      if (data != null) {
        data[index].selectedQty = data[index].selectedQty - 1;
        localStorage.setItem(DATABASE_KEY.userCart, JSON.stringify(data));
        this.reloadService.needRefreshCart$();
      }
    }
  }

  onDeleteCartItem(cartId: string, productId?: string) {
    if (this.userService.getUserStatus()) {
      this.deleteCartById(cartId);
    } else {
      this.cartService.deleteCartItemFromLocalStorage(productId);
      this.reloadService.needRefreshCart$(true);
    }
  }

  //
  // onDeleteCartItem(cartData: Cart,cartId: string, productId?: string, ) {
  //   if (this.userService.getUserStatus()) {
  //     this.deleteCartById(cartId);
  //   } else {
  //     if (cartData.cartType){
  //       this.cartService.deleteComboCartItemFromLocalStorage(cartData);
  //       this.reloadService.needRefreshCart$();
  //     }
  //     else{
  //       this.cartService.deleteCartItemFromLocalStorage(productId);
  //
  //       this.reloadService.needRefreshCart$();
  //     }
  //
  //   }
  // }
  //
  //
  //
  // /**
  //  * Calculation
  //  * cartSubTotal()
  //  */
  //
  get cartSubTotal(): number {
    return this.carts
      .map((t) => {
        return this.pricePipe.transform(
          t.product as Product,
          'salePrice',
          t.selectedQty
        ) as number;
      })
      .reduce((acc, value) => acc + value, 0);
  }

  /**
   * cartSlideShowHide()
   */
  cartSlideShowHide() {
    this.cartSlide = !this.cartSlide;
  }
  /**
 * DESTROY SUBSCRIPTION
 */
  ngOnDestroy(): void {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
    if (this.subDeleteCartData) {
      this.subDeleteCartData.unsubscribe();
    }

    if (this.subUpdateCartData) {
      this.subUpdateCartData.unsubscribe();
    }
    if (this.subReloadCart) {
      this.subReloadCart.unsubscribe();
    }
  }
}
