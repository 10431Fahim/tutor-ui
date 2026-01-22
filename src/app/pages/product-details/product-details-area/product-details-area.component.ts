import {Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges} from '@angular/core';
import { Product } from 'src/app/interfaces/common/product';
import { CartService } from 'src/app/services/common/cart.service';
import { ReloadService } from 'src/app/services/core/reload.service';
import { Cart } from 'src/app/interfaces/common/cart.interface';
import { Subscription } from 'rxjs';
import { WishListService } from 'src/app/services/common/wish-list.service';
import { WishList } from 'src/app/interfaces/common/wish-list.interface';
import { UiService } from 'src/app/services/core/ui.service';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/common/user.service';
import { Router } from '@angular/router';
import { ProductService } from "../../../services/common/product.service";
import { DATABASE_KEY } from 'src/app/core/utils/global-variable';
import {SocialShareComponent} from "../../../shared/dialog-view/social-share/social-share.component";
import {PdfViewerComponent} from "../../../shared/dialog-view/pdf-viewer/pdf-viewer.component";

@Component({
  selector: 'app-product-details-area',
  templateUrl: './product-details-area.component.html',
  styleUrls: ['./product-details-area.component.scss']
})
export class ProductDetailsAreaComponent implements OnInit, OnDestroy,OnChanges {

  @Input() product: Product;
  @Input() ratingCalculation: any;
  @Input() relatedProducts: Product[];
  productId = null;
  //Cart Data
  carts: Cart[] = [];
  cart: Cart;

  // Wishlist Data
  wishlists: WishList[];
  wishlist: WishList = null;

  //Subscription
  private subReloadOne: Subscription;
  private subReloadTwo: Subscription;
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour: Subscription;

  constructor(
    private reloadService: ReloadService,
    private cartService: CartService,
    private wishListService: WishListService,
    private userService: UserService,
    private uiService: UiService,
    private productService: ProductService,
    private matDialog: MatDialog,
    private router: Router
  ) {

  }
  ngOnInit() {



    // CART FUNCTION STORED
    this.subReloadOne = this.cartService.refreshStoredCart$.subscribe(() => {
      this.carts = this.cartService.cartItems;
      this.checkCartList();
    });
    this.carts = this.cartService.cartItems;
    this.checkCartList();

    // WiSHLIST FUNCTION STORED
    if (this.userService.getUserStatus()) {
      this.subReloadTwo = this.reloadService.refreshWishList$.subscribe(() => {
        this.getWishListByUser();
      });
    }
    if (this.userService.getUserStatus()) {
      this.getWishListByUser();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('product111',this.product)
  }

  /**
   * Button Click Event Handle
   * onAddToCart()
   * onAddToWishList()
   */
  onAddToCart(event: MouseEvent) {
    event.stopPropagation();
    const data: Cart = {
      product: this.product?._id,
      selectedQty: 1,
    };
    if (this.userService.getUserStatus()) {
      this.addToCartDB(data);
    } else {
      this.cartService.addCartItemToLocalStorage(data);
      this.reloadService.needRefreshCart$(true);
    }
  }

  onAddToCartAndRedirect(event: MouseEvent) {
    event.stopPropagation();
    const data: Cart = {
      product: this.product?._id,
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

      this.router
        .navigate(['/login'], {
          queryParams: { navigateFrom: this.router.url },
        })
        .then();
    }
  }

  onAddToWishList(event: MouseEvent) {
    event.stopPropagation();
    if (this.wishlist) {
      this.removeWishlistById(this.wishlist?._id);
    } else {
      const data: WishList = {
        product: this.product?._id,
        selectedQty: 1,
      };
      if (this.userService.getUserStatus()) {
        this.addToWishListDB(data);
      } else {
        this.router.navigate(['/login'],{queryParams: {navigateFrom:this.router.url}, queryParamsHandling: 'merge'});
        this.reloadService.needRefreshWishList$();
      }
    }

  }

  /**
  * HTTP REQ HANDLE
  * addToCartDB()
  * updateCartQty()
  * addToWishListDB()
  * removeWishlistById()
  */

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


  private updateCartQty(cartId: string, data: any) {
    this.subDataTwo = this.cartService.updateCartQty(cartId, data)
      .subscribe(() => {
        this.reloadService.needRefreshCart$(true);
      }, error => {
        console.log(error);
      });
  }



  private getWishListByUser() {
    this.subDataTwo = this.wishListService.getWishListByUser()
      .subscribe(res => {
        this.wishlists = res.data;
        this.checkWishList();
        // console.log('w', this.wishlist);
      }, error => {
        console.log(error);
      });
  }

  addToWishListDB(data: WishList) {
    this.subDataThree = this.wishListService.addToWishList(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshWishList$();
      }, error => {
        console.log(error);
      });
  }


  public removeWishlistById(wishlistId: string) {
    this.subDataFour = this.wishListService.deleteWishListById(wishlistId)
      .subscribe(res => {
        this.reloadService.needRefreshWishList$();
        this.uiService.success(res.message);
      }, error => {
        console.log(error);
      });
  }

  /**
   * LOGICAL METHODS
   * checkCartList()
   * checkWishList()
   * onIncrementQty()
   * onDecrementQty()
   */


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

  onDecrementQty(event: MouseEvent) {
    event.stopPropagation();
    if (this.cart.selectedQty === 1) {
      this.uiService.warn('Minimum quantity is 1');
      return;
    }
    if (this.userService.getUserStatus()) {
      this.updateCartQty(this.cart._id, { selectedQty: 1, type: 'decrement' });
    } else {
      const data = this.cartService.getCartItemFromLocalStorage();
      if (data != null) {
        const fIndex = data.findIndex(f => (f.product as string) === (this.cart.product as Product)._id);
        data[fIndex].selectedQty = data[fIndex].selectedQty - 1;
        localStorage.setItem(DATABASE_KEY.userCart, JSON.stringify(data));
        this.reloadService.needRefreshCart$(true);
      }
    }
  }

  checkCartList() {
    this.cart = this.carts.find(f => (f.product as any)._id === this.product?._id);
  }
  checkWishList() {
    this.wishlist = this.wishlists.find(f => (f.product as Product)._id === this.product._id);
  }

  //Share social

  onDialogOpen() {
    this.matDialog.open(SocialShareComponent, {
      data: this.product,
      maxWidth: "500px",
      width: "100%",
      height: "auto",
      panelClass: ['dialog', 'social-dialog']
    })
  }

  //View pdf
  viewPdf() {
    this.matDialog.open(PdfViewerComponent, {
      data: this.product,
      maxWidth: "1000px",
      width: "100%",
      maxHeight: "710px",
      panelClass: ['dialog', 'social-dialog']
    })
  }



  /**
  * ON NG DESTROY
  */

  ngOnDestroy(): void {
    if (this.subReloadOne) {
      this.subReloadOne.unsubscribe();
    }
    if (this.subReloadTwo) {
      this.subReloadTwo.unsubscribe();
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

  /**
   * compare product
   * addToCompareList()
   */
  addToCompareList(event: MouseEvent, product: Product) {
    event.stopPropagation();
    this.productId = product?._id;
    this.productService.addToCompare(this.productId, product?.category?._id);
    this.reloadService.needRefreshCompareList$();
  }
}
