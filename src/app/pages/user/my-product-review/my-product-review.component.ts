import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {CartService} from "../../../services/common/cart.service";
import {UiService} from "../../../services/core/ui.service";
import {ReloadService} from "../../../services/core/reload.service";
import {UserService} from "../../../services/common/user.service";
import {Router} from "@angular/router";
import {ProductReviewService} from "../../../interfaces/common/product-review.service";
import {ProductReview} from "../../../interfaces/common/product-review.interface";

@Component({
  selector: 'app-my-product-review',
  templateUrl: './my-product-review.component.html',
  styleUrls: ['./my-product-review.component.scss']
})
export class MyProductReviewComponent implements OnInit, OnDestroy {

  //Store Data
  productReviews: ProductReview[];
  productReview: ProductReview;


  //Subscription
  private subReloadOne: Subscription;
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour: Subscription;


  constructor(
    private productReviewService: ProductReviewService,
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
    this.subReloadOne = this.reloadService.refreshProductReview$.subscribe(() => {
      this.getProductReviewByUser();
    });

    /**
     * GET BASE DATA
     */
    this.getProductReviewByUser();

  }


  private getProductReviewByUser() {
    this.subDataTwo = this.productReviewService.getReviewByUserId()
      .subscribe(res => {
        this.productReviews = res.data;
        console.log('this.productReviews',this.productReviews)
      }, error => {
        console.log(error);
      });
  }

  public removeProductReviewById(productReviewId: string) {
    this.subDataThree = this.productReviewService.deleteReviewByReviewId(productReviewId)
      .subscribe(res => {
        this.reloadService.needRefreshProductReview$();
        this.uiService.success(res.message);
      }, error => {
        console.log(error);
      });
    this.reloadService.needRefreshData$();
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
