import {Injectable} from '@angular/core';
import {Cart} from '../../interfaces/common/cart.interface';
import {DATABASE_KEY} from '../../core/utils/global-variable';
import {ReloadService} from '../core/reload.service';
import {Subject} from 'rxjs';
import {environment} from 'src/environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ResponsePayload} from 'src/app/interfaces/core/response-payload.interface';

const API_CART = environment.apiBaseLink + '/api/cart/';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  /**
 * REFRESH LOCAL STORED CART
 */
  private refreshStoredCart = new Subject<void>();

  get refreshStoredCart$() {
    return this.refreshStoredCart;
  }

  needRefreshStoredCart$() {
    this.refreshStoredCart.next();
  }

  // Store Data
  private cartList: Cart[] = [];

  constructor(
    private httpClient: HttpClient,
    private reloadService: ReloadService,
  ) {
  }

  /**
   * addToCart
   * getCartByUserId
   * deleteCartById
   * updateCartById
   * updateCartQty
   */

  addToCart(data: Cart) {
    return this.httpClient.post<ResponsePayload>
      (API_CART + 'add-to-cart', data);
  }

  addToCartMultiple(data: Cart[]) {
    return this.httpClient.post<ResponsePayload>
      (API_CART + 'add-to-cart-multiple', data);
  }

  getCartByUser() {
    return this.httpClient.get<{ data: Cart[], count: number, success: boolean }>(API_CART + 'get-carts-by-user');
  }

  deleteCartById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_CART + 'delete/' + id, { params });
  }

  updateCartById(id: string, data: Cart) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_CART + 'update/' + id, data);
  }

  updateCartQty(id: string, data: { selectedQty: number, type: string }) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_CART + 'update-qty/' + id, data);
  }



  /**
   * CART LOCAL STORAGE
   * addCartItemToLocalStorage()
   * getCartItemFromLocalStorage()
   * deleteCartItemFromLocalStorage()
   * deleteAllCartFromLocal()
   */
  addCartItemToLocalStorage(cartItem: Cart) {
    // console.log(product);
    const items = JSON.parse(localStorage.getItem(DATABASE_KEY.userCart));

    let carts;

    if (!items) {
      carts = [];
      carts.push(cartItem);
    } else {
      carts = items;
      const fIndex = carts.findIndex((o) => o.product === cartItem.product);
      if (fIndex === -1) {
        carts.push(cartItem);
      } else {
        carts[fIndex].selectedQty += 1;
      }
    }
    localStorage.setItem(DATABASE_KEY.userCart, JSON.stringify(carts));
  }


  // addComboCartItemToLocalStorage(cartItem: Cart) {
  //   const items = JSON.parse(localStorage.getItem(DATABASE_KEY.userCart));
  //   let carts;
  //   if (!items) {
  //     carts = [];
  //     carts.push(cartItem);
  //   } else {
  //
  //
  //
  //     carts = items;
  //     let productPush = false;
  //     items.map((item, j) => {
  //       if (item.cartType == 1) {
  //         if (item.specialPackage == cartItem.specialPackage) {
  //           carts[j].selectedQty += 1;
  //           productPush = true;
  //         }
  //       } else {
  //         if (item.product === cartItem.product) {
  //           if (item?.selectedVariation && cartItem?.selectedVariation) {
  //             if (cartItem?.selectedVariation == item.selectedVariation) {
  //               carts[j].selectedQty += 1;
  //               productPush = true;
  //             }
  //           } else {
  //             carts[j].selectedQty += 1;
  //             productPush = true;
  //           }
  //         }
  //       }
  //
  //     })
  //     if (!productPush) {
  //       // console.warn("Out Product PUSH")
  //       carts.push(cartItem);
  //     }
  //   }
  //   localStorage.setItem(DATABASE_KEY.userCart, JSON.stringify(carts));
  // }

  getCartItemFromLocalStorage(): Cart[] {
    const carts = localStorage.getItem(DATABASE_KEY.userCart);
    if (carts === null) {
      return [];
    }
    return JSON.parse(carts) as Cart[];
  }

  deleteCartItemFromLocalStorage(id: string) {
    const items = JSON.parse(localStorage.getItem(DATABASE_KEY.userCart));
    const filtered = items.filter(el => el.product !== id);
    localStorage.setItem(DATABASE_KEY.userCart, JSON.stringify(filtered));
  }


  deleteAllCartFromLocal(refresh?: boolean) {
    localStorage.removeItem(DATABASE_KEY.userCart);
    this.reloadService.needRefreshCart$(refresh ? refresh : false);
  }

  // deleteAllCartFromLocal(refresh?: boolean) {
  //   localStorage.removeItem(DATABASE_KEY.userCart);
  //   this.reloadService.needRefreshCart$(refresh ? refresh : false);
  // }
  //
  // deleteComboCartItemFromLocalStorage(cartItem: Cart) {
  //   const carts = JSON.parse(localStorage.getItem(DATABASE_KEY.userCart));
  //   var newCarts: Cart[] = [];
  //   carts.map((item: Cart, i) => {
  //     console.warn(cartItem)
  //     if (item.cartType == 1) {
  //       if (item.specialPackage != (cartItem.product as Product)?._id) {
  //         newCarts.push(item)
  //       }
  //     } else if (item.cartType == 2) {
  //       // if (item.specialPackage != (cartItem.product as Product)._id) {
  //       //   newCarts.push(item)
  //       // }
  //     } else {
  //       if (item.product === (cartItem.product as Product)?._id) {
  //         if (item.selectedVariation || cartItem.selectedVariation) {
  //           if ((item.selectedVariation !== (cartItem.selectedVariation as any)?._id)) {
  //             newCarts.push(item)
  //           }
  //         }
  //       } else {
  //         newCarts.push(item)
  //       }
  //     }
  //
  //   })
  //   console.warn(newCarts)
  //   // const filtered = items.filter(el => el.product !== id);
  //   localStorage.setItem(DATABASE_KEY.userCart, JSON.stringify(newCarts));
  //   this.reloadService.needRefreshCart$(true);
  // }
  /**
   * CART STORE & GET LOCALLY
   * updateCartList()
   * cartItems()
   */
  public updateCartList(data: Cart[]) {
    this.cartList = data;
    this.needRefreshStoredCart$();
  }

  public get cartItems() {
    return [...this.cartList]
  }



}
