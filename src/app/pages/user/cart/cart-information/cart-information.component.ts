import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Cart} from 'src/app/interfaces/common/cart.interface';
import {Product} from 'src/app/interfaces/common/product';
import {CartService} from 'src/app/services/common/cart.service';
import {UserDataService} from 'src/app/services/common/user-data.service';
import {UserService} from 'src/app/services/common/user.service';
import {ReloadService} from 'src/app/services/core/reload.service';
import {UiService} from 'src/app/services/core/ui.service';
import {EngBnNumPipe} from 'src/app/shared/pipes/eng-bn-num.pipe';
import {PricesPipe} from "../../../../shared/pipes/prices.pipe";

@Component({
  selector: 'app-cart-information',
  templateUrl: './cart-information.component.html',
  styleUrls: ['./cart-information.component.scss'],
  providers: [PricesPipe, EngBnNumPipe]
})
export class CartInformationComponent implements OnInit,OnDestroy {
  // Cart Data
  carts: Cart[] = [];
  empty:boolean = false;

  // Subscriptions
  private subReloadCart: Subscription;
  private subDataOne:Subscription;
  private subUpdateCartData:Subscription;
  private subDeleteCartData:Subscription;

  constructor(
    private router: Router,
    public userService: UserService,
    public userDataService: UserDataService,
    private cartService: CartService,
    private reloadService: ReloadService,
    private uiService: UiService,
    private pricePipe: PricesPipe,
  ) { }

  ngOnInit(): void {

    // Cart Reload Data & Get Data
    this.subReloadCart = this.reloadService.refreshCart$.subscribe((res) => {
      this.getCartsItems(res);
    });
    this.getCartsItems();
  }

  /**
   * HTTP REQ HANDLE
   * getCartsItems()
   * updateCartQty()
   * deleteCartById()
   */
  private getCartsItems(refresh?: boolean) {
    if (this.userService.getUserStatus()) {
      this.subDataOne = this.cartService.getCartByUser().subscribe((res) => {
        this.carts = res.data;
        // console.log('this.carts',this.carts);
        this.empty =  this.carts && this.carts.length > 0 ? true : false;

        this.cartService.updateCartList(this.carts);
      });
    } else{
       this.router.navigate(['/','login']);
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
        this.reloadService.needRefreshCart$(false);
      },
      (error) => {
        console.log(error);
      }
    );
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
    }else{
        this.router.navigate(['/','login']);
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
      this.router.navigate(['/','login']);
    }
  }

  onDeleteCartItem(cartId: string, productId?: string) {
    if (this.userService.getUserStatus()) {
      this.deleteCartById(cartId);
    } else {
      this.router.navigate(['/','login']);
    }
  }

  /**
   * Calculation
   * cartSubTotal()
   */

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
   * PALACE ORDER
   * onOrder()
   */

  placeOrder(){
      if(this.carts && this.carts.length > 0){
          this.router.navigate(['/','checkout']);
      }else{
          this.uiService.warn('Your carts is empty! please Add to cart product');
          this.router.navigate(['/','product-list']);
      }
  }

  /**
   * DESTROY SUBSCRIPTION
   */

  ngOnDestroy(): void {
    if(this.subDataOne){
        this.subDataOne.unsubscribe();
    }
    if(this.subDeleteCartData){
        this.subDeleteCartData.unsubscribe();
    }

    if(this.subUpdateCartData){
        this.subUpdateCartData.unsubscribe();
    }
    if(this.subReloadCart){
        this.subReloadCart.unsubscribe();
    }
  }




}
