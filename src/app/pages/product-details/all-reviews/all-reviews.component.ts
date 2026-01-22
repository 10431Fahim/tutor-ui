import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {SafeResourceUrl} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {Product} from 'src/app/interfaces/common/product';
import {ProductService} from 'src/app/services/common/product.service';
import {ReloadService} from 'src/app/services/core/reload.service';
import {RatingAndReviewComponent} from '../rating-and-review/rating-and-review.component';
import {Pagination} from "../../../interfaces/core/pagination.interface";
import {FilterData} from "../../../interfaces/core/filter-data.interface";
import {ProductReview} from "../../../interfaces/common/product-review.interface";
import {ProductReviewService} from "../../../interfaces/common/product-review.service";

@Component({
  selector: 'app-all-reviews',
  templateUrl: './all-reviews.component.html',
  styleUrls: ['./all-reviews.component.scss']
})
export class AllReviewsComponent implements OnInit, OnDestroy {
  // Store data
  id?: string;
  product: Product | any;
  safeURL: SafeResourceUrl;
  allReviews: ProductReview[] = [];
  avgRating: any;
  navUrl: string;
  ratingTotalData: any;
  ratingData: any;
  ratingCalculation: any;

  // Subscriptions
  private subRouteParam: Subscription;
  private subDataOne: Subscription;
  private subDataTwo: Subscription;

  constructor(
    private activateRoute: ActivatedRoute,
    private productService: ProductService,
    private reviewService: ProductReviewService,
    private reloadService: ReloadService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    // get activated route
    this.subRouteParam = this.activateRoute.paramMap.subscribe(param => {
      this.id = param.get('id');
      if (this.id) {
        this.getProductBySlug();
      }
    });

  }

  /**
   * HTTP REQUEST HANDLE
   * getProductBySlug()
   * getAllReviews()
   *
   */

  private getProductBySlug() {
    this.subDataOne = this.productService.getProductById(this.id)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.product = res.data;
            this.getAllReviews();
            this.ratingTotalData = this.product.ratingTotal;
            this.ratingData = this.product?.ratingCount;
            this.ratingCalculation = (this.ratingData / this.ratingTotalData);
          }
        },
        error: (err) => {
          console.log(err);
        }
      });
  }


  private getAllReviews() {
    const pagination: Pagination = {
      pageSize: 12,
      currentPage: 0
    };

    // Select
    const mSelect = {
      name: 1,
      user: 1,
      product: 1,
      review: 1,
      images: 1,
      rating: 1,
      status: 1,
      reviewDate: 1,
      reply: 1,
      replyDate: 1,
    }

    const filterData: FilterData = {
      pagination: pagination,
      filter: { 'product._id': this.product._id, status: true },
      select: mSelect,
      sort: { createdAt: -1 }
    }

    this.subDataTwo = this.reviewService.getAllReviewsByQuery(filterData, null)
      .subscribe(res => {
        this.allReviews = res.data;
        // console.log(this.allReviews);
      }, error => {
        console.log(error);
      });

  }

  /**
  * Dialog Component
  * openAddressDialog()
  */
  openReviewDialog() {
    this.reloadService.needRefreshData$();
    const dialogRef = this.dialog.open(RatingAndReviewComponent, {
      panelClass: ['theme-dialog'],
      width: '100%',
      maxWidth: '850px',
      maxHeight: '100%',
      autoFocus: false,
      disableClose: false,
      data: this.product?._id,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {

        dialogRef.close(dialogResult)
      }
    });
  }


  getRatingPercent(ratingCount: number) {
    return Math.floor((ratingCount / this.product?.ratingTotal) * 100);
  }

  /**
   * NG ON DESTROY
   */
  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
    if (this.subDataTwo) {
      this.subDataTwo.unsubscribe();
    }
    if (this.subRouteParam) {
      this.subRouteParam.unsubscribe();
    }
  }




}
