import {Component, OnDestroy, OnInit} from '@angular/core';
import {WishList} from 'src/app/interfaces/common/wish-list.interface';
import {WishListService} from 'src/app/services/common/wish-list.service';
import {UiService} from 'src/app/services/core/ui.service';
import {CartService} from '../../../../services/common/cart.service';
import {ReloadService} from 'src/app/services/core/reload.service';
import {Subscription} from 'rxjs';
import {Cart} from 'src/app/interfaces/common/cart.interface';
import {Product} from 'src/app/interfaces/common/product';
import {UserService} from 'src/app/services/common/user.service';
import {Router} from '@angular/router';
import {DATABASE_KEY} from "../../../../core/utils/global-variable";

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.scss']
})
export class WishListComponent implements OnInit, OnDestroy {

  //Store Data
  wishlists: WishList[];
  wishlist: WishList;

  //Cart Data
  carts: Cart[] = [];
  cart: Cart;

  //Subscription
  private subReloadOne: Subscription;
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour: Subscription;


  constructor(
    private wishlistService: WishListService,
    private cartService: CartService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private userService: UserService,
    private router: Router

  ) {

  }

  ngOnInit(): void {

    /**
     * REALOAD WISH AND CART
     */
    this.subReloadOne = this.reloadService.refreshWishList$.subscribe(() => {
      this.getWishListByUser();
    });

    /**
     * GET BASE DATA
     */
    this.getWishListByUser();

  }


  /**
   * HTTP REQUEST HANDLE
   * addToCartDB()
   * getCartByUser()
   * getWishListByUser()
   * removeWishlistById
   */
  // addToCartDB(data: Cart) {
  //   this.subDataOne = this.cartService.addToCart(data)
  //     .subscribe(res => {
  //       this.uiService.success(res.message);
  //       this.reloadService.needRefreshCart$(true);
  //     }, error => {
  //       console.log(error);
  //     });
  // }

  addToCartDB(data: Cart,url?: string) {
    this.subDataOne = this.cartService.addToCart(data)
      .subscribe(res => {
        console.log(res);
        this.uiService.success(res.message);
        this.reloadService.needRefreshCart$(true);
        if (url) {
          this.router.navigate(['/checkout'])
        }
      }, error => {
        console.log(error);
      });
  }

  getCartByUser() {
    this.subDataFour = this.cartService.getCartByUser().subscribe(
      (res) => {
        if (res.success) {
          this.carts = res.data;
        }
      },
      (err) => {

      }
    )
  }

  private getWishListByUser() {
    this.subDataTwo = this.wishlistService.getWishListByUser()
      .subscribe(res => {
        this.wishlists = res.data;
        // console.log('this.wishlists',this.wishlists)
      }, error => {
        console.log(error);
      });
  }
  public removeWishlistById(wishlistId: string) {
    this.subDataThree = this.wishlistService.deleteWishListById(wishlistId)
      .subscribe(res => {
        this.reloadService.needRefreshWishList$();
        this.uiService.success(res.message);
      }, error => {
        console.log(error);
      });
    this.reloadService.needRefreshData$();
  }

  onAddToCart(d:any) {
    event.stopPropagation();
    const data: Cart = {
      product: d?.product?._id,
      selectedQty: 1,
    };
    if (this.userService.getUserStatus()) {
      this.addToCartDB(data);
    } else {
      this.router.navigate(['/', 'login'])
    }
  }


  onAddToCartAndRedirect(wishlists:any) {

    event.stopPropagation();
    for (const d of wishlists) {
      const data: Cart = {
        product: d?.product?._id,
        selectedQty: 1,
      };
      if (this.userService.getUserStatus()) {
        if (this.cart) {
          this.onIncrementQty(null, '/checkout')
        } else {
          this.addToCartDB(data, '/checkout');
        }
      } else {
        this.cartService.addCartItemToLocalStorage(data);
        this.reloadService.needRefreshCart$(true);
        this.router.navigate(['/checkout']);
      }
    }


  }


  onIncrementQty(event?: MouseEvent, url?: string) {
    if (event) {
      event.stopPropagation();
    }
    if (this.userService.getUserStatus()) {
      if (event && this.cart.selectedQty === 6) {
        this.uiService.warn('Maximum quantity are 6');
      } else {
        this.updateCartQty(this.cart._id, { selectedQty: 1, type: 'increment' });
        if (url) {
          this.router.navigate(['/checkout'])
        }
      }
      return;
    } else {
      const data = this.cartService.getCartItemFromLocalStorage();
      if (data != null) {
        const fIndex = data.findIndex(f => (f.product as string) === (this.cart.product as Product)._id);
        // data[fIndex].selectedQty = data[fIndex].selectedQty + 1;
        // localStorage.setItem(DATABASE_KEY.userCart, JSON.stringify(data));
        // this.reloadService.needRefreshCart$(true);
        if (event && data[fIndex].selectedQty === 6) {

          this.uiService.warn('Maximum quantity are 6');
          return;
        } else {
          data[fIndex].selectedQty = data[fIndex].selectedQty + 1;
          localStorage.setItem(DATABASE_KEY.userCart, JSON.stringify(data));
          this.reloadService.needRefreshCart$(true);
          return;
        }

      }
    }

    if (url) {
      this.router.navigate(['/checkout'])
    }
  }

  private updateCartQty(cartId: string, data: any) {
    this.subDataTwo = this.cartService.updateCartQty(cartId, data)
      .subscribe(() => {
        this.reloadService.needRefreshCart$(true);
      }, error => {
        console.log(error);
      });
  }


  /**
   * ON DESTROY ALL SUBSCRIPTION
   */
  ngOnDestroy(): void {
    if (this.subReloadOne) {
      this.subReloadOne.unsubscribe();
    }
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
    if (this.subDataTwo) {
      this.subDataTwo.unsubscribe();
    }
    if (this.subDataThree) {
      this.subDataThree.unsubscribe();
    }
    if (this.subDataFour) {
      this.subDataFour.unsubscribe();
    }
  }

}
