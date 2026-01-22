import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Product } from 'src/app/interfaces/common/product';
import { ReloadService } from 'src/app/services/core/reload.service';
import { Cart } from 'src/app/interfaces/common/cart.interface';
import { Subscription } from 'rxjs';
// import { WishList } from 'src/app/interfaces/common/wish-list.interface';
// import { WishListService } from 'src/app/services/common/wish-list.service';
import { UiService } from 'src/app/services/core/ui.service';
import { UserService } from 'src/app/services/common/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from "../../../services/common/product.service";
import {WishList} from "../../../interfaces/common/wish-list.interface";
import {WishListService} from "../../../services/common/wish-list.service";
import {CartService} from "../../../services/common/cart.service";
@Component({
  selector: 'app-product-card-one',
  templateUrl: './product-card-one.component.html',
  styleUrls: ['./product-card-one.component.scss']
})
export class ProductCardOneComponent implements OnInit, OnDestroy {
  @Input() data: Product;
  @Input() isNew?: boolean = false;
  productId = null;
  //Cart Data
  carts: Cart[] = [];
  cart: Cart;

  // Wishlist Data
  wishlists: WishList[] = [];
  wishlist: WishList = null;

  //Subscription
  private subReloadOne: Subscription;
  private subReloadTwo: Subscription;
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour: Subscription;

  // seoPage: SeoPage;
  language: string;
  private subDataFive: Subscription;

  isChangeLanguage: boolean = false;
  isChangeLanguageToggle: string = 'en';

  constructor(
    private cartService: CartService,
    private reloadService: ReloadService,
    private wishListService: WishListService,
    private userService: UserService,
    // public translateService: TranslateService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private router: Router
  ) {

  }

  ngOnInit(): void {

    this.activatedRoute.queryParamMap.subscribe(qPram => {
      this.language = qPram.get('language');
    })
    // CART FUNCTION STORED
    this.subReloadOne = this.cartService.refreshStoredCart$.subscribe(() => {
      this.carts = this.cartService.cartItems;
      this.checkCartList();
    });

    this.carts = this.cartService.cartItems;
    this.checkCartList();

    // if (this.userService.getUserStatus()) {
    //   // WiSHLIST FUNCTION STORED
    //   this.subReloadTwo = this.reloadService.refreshWishList$.subscribe(() => {
    //     this.getWishListByUser();
    //   });
    //   this.getWishListByUser();
    // }
    // // CART FUNCTION STORED
    // this.subReloadOne = this.reloadService.refreshCompareList$.subscribe(() => {
    //   this.getCompareList();
    // });
  }


  /**
   * COMPARE ITEM COUNT
   */
  getCompareList() {
    this.productService.getCompareList().length;
  }
  /**
   * Button Click Event Handle
   * onAddToCart()
   * onAddToWishList()
   */

  // onAddToCart(event: MouseEvent) {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   const data: Cart = {
  //     product: this.data?._id,
  //     selectedQty: 1,
  //   };
  //   if (this.userService.getUserStatus()) {
  //     this.addToCartDB(data);
  //   } else {
  //     this.cartService.addCartItemToLocalStorage(data);
  //     this.reloadService.needRefreshCart$(true);
  //   }
  // }

  onAddToCart(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const data: Cart = {
      product: this.data?._id,
      selectedQty: 1,
    };
    if (this.userService.getUserStatus()) {
      this.addToCartDB(data);
    } else {
      this.cartService.addCartItemToLocalStorage(data);
      this.reloadService.needRefreshCart$(true);
    }
  }

  // onAddToWishList(event: MouseEvent) {
  //   event.preventDefault();
  //   event.stopPropagation();
  //
  //   if (this.wishlist) {
  //     this.removeWishlistById(this.wishlist?._id);
  //   } else {
  //     const data: WishList = {
  //       product: this.data?._id,
  //       selectedQty: 1,
  //     };
  //     if (this.userService.getUserStatus()) {
  //       this.addToWishListDB(data);
  //     } else {
  //       this.router.navigate(['/login']);
  //       this.reloadService.needRefreshWishList$();
  //     }
  //   }
  //
  // }

  /**
 * HTTP REQ HANDLE
 * addToCartDB()
 * addToWishListDB()
 * removeWishlistById()
 * getWishListByUser()
 */

  addToCartDB(data: Cart) {
    this.subDataOne = this.cartService.addToCart(data)
      .subscribe(res => {
        this.uiService.success(res.message);
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
      }, error => {
        console.log(error);
      });
  }


  // addToWishListDB(data: WishList) {
  //   this.subDataThree = this.wishListService.addToWishList(data)
  //     .subscribe(res => {
  //       this.uiService.success(res.message);
  //       this.reloadService.needRefreshWishList$();
  //     }, error => {
  //       console.log(error);
  //     });
  // }
  //
  // public removeWishlistById(wishlistId: string) {
  //   this.subDataFour = this.wishListService.deleteWishListById(wishlistId)
  //     .subscribe(res => {
  //       this.reloadService.needRefreshWishList$();
  //       this.uiService.success(res.message);
  //     }, error => {
  //       console.log(error);
  //     });
  // }



  /**
   * LOGICAL METHODS
   * checkCartList()
   * checkWishList()
   */

  checkCartList() {
    this.cart = this.carts?.find(f => (f.product as any)?._id === this.data?._id);
  }
  checkWishList() {
    this.wishlist = this.wishlists?.find(f => (f.product as Product)?._id === this.data._id);

  }

  /**
   * compare product
   * addToCompareList()
   */
  addToCompareList(event: MouseEvent, product: Product) {
    event.preventDefault();
    event.stopPropagation();
    this.productId = product?._id;
    this.productService.addToCompare(this.productId, product?.category?._id);
    this.reloadService.needRefreshCompareList$();
  }



  /** On Destroy */

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
}
