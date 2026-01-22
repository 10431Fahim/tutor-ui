import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReloadService {
  private refreshUser = new Subject<void>();
  private refreshData = new Subject<void>();
  private refresPlay = new Subject<boolean>();
  private refreshCompareList = new Subject<void>();
  private refreshWishList = new BehaviorSubject<boolean>(false);
  private refreshProductReview = new BehaviorSubject<boolean>(false);
  private refreshSearch = new BehaviorSubject<boolean>(false);
  private refreshCart = new BehaviorSubject<boolean>(false);
  private refreshCategorySlide = new BehaviorSubject<boolean>(false);
  private refreshSticky = new Subject();
  /**
   * REFRESH GLOBAL DATA
   * refreshData$()
   * needRefreshData$()
   */

  needRefreshSearch$(data?: boolean) {
    if (data && data === true) {
      this.refreshSearch.next(data);
    } else {
      this.refreshSearch.next(false);
    }
  }


  get refreshAutoplay$() {
    return this.refresPlay;
  }

  needRefreshAutoPlay$(a: any) {
    this.refresPlay.next(a);
  }

  get refreshData$() {
    return this.refreshData;
  }

  needRefreshData$() {
    this.refreshData.next();
  }


  /**
   * REFRESH GLOBAL DATA
   */
  get refreshWishList$() {
    return this.refreshWishList;
  }
  needRefreshWishList$(data?: boolean) {
    if (data && data === true) {
      this.refreshWishList.next(data);
    } else {
      this.refreshWishList.next(false);
    }
  }

  get refreshProductReview$() {
    return this.refreshProductReview;
  }
  needRefreshProductReview$(data?: boolean) {
    if (data && data === true) {
      this.refreshProductReview.next(data);
    } else {
      this.refreshProductReview.next(false);
    }
  }


  /**
   Category Slide Refresh
   */
  get refreshCategorySlide$() {
    return this.refreshCategorySlide;
  }
  needRefreshCategorySlide(data: boolean) {
    this.refreshCategorySlide.next(data);
  }

  /**
   * CART
   */
  get refreshCart$() {
    return this.refreshCart;
  }

  needRefreshCart$(data?: boolean) {
    if (data && data === true) {
      this.refreshCart.next(data);
    } else {
      this.refreshCart.next(false);
    }
  }

  /**
   * REFRESH COMPARE DATA
   */
  get refreshCompareList$() {
    return this.refreshCompareList;
  }

  needRefreshCompareList$() {
    this.refreshCompareList.next();
  }

  /**
   * REFRESH USEr DATA
   * refreshUser$()
   * needRefreshUser$()
   */

  get refreshUser$() {
    return this.refreshUser;
  }

  needRefreshUser$() {
    this.refreshUser.next();
  }

  /**
   * REFRESH Sticky
   */

  get refreshSticky$() {
    return this.refreshSticky;
  }

  needRefreshSticky$(data: boolean) {
    this.refreshSticky.next(data);
  }
}
