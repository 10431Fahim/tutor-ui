import { Component, OnInit, inject } from '@angular/core';
import { Order } from '../../../interfaces/common/order.interface';
import { FilterData } from '../../../interfaces/core/filter-data.interface';
import { OrderService } from '../../../services/common/order.service';
import { UiService } from '../../../services/core/ui.service';
import { ReviewService } from '../../../services/common/review.service';
import { faAngleRight, faFilePdf, faPlay, faVideoCamera } from '@fortawesome/free-solid-svg-icons';
import { UserDataService } from '../../../services/common/user-data.service';

@Component({
  selector: 'app-my-review',
  templateUrl: './my-review.component.html',
  styleUrls: ['./my-review.component.scss'],
})
export class MyReviewComponent implements OnInit {
  // Font Awesome Icon
  faAngleRight = faAngleRight;
  faVideoCamera = faVideoCamera;
  faFilePdf = faFilePdf;
  faPlay = faPlay;

  // Store Data
  private filter: any;
  orders: Order[] = [];
  selectedStatus = 'all';
  userPhone: string = '';

  // Loader
  loader: boolean = false;

  // Inject
  private readonly orderService = inject(OrderService);
  private readonly uiService = inject(UiService);
  private readonly reviewService = inject(ReviewService);
  private readonly userDataService = inject(UserDataService);

  ngOnInit() {
    // Fetch user phone number
    this.getUserPhone();
    // Base Data
    this.getAllOrdersByUser();
  }

  // [NEW] Fetch user phone number from account
  private getUserPhone() {
    this.userDataService.getLoggedInUserData('phone').subscribe({
      next: (res) => {
        if (res && res.data && res.data.phone) {
          this.userPhone = res.data.phone;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**
   * HTTP REQ HANDLE
   * getAllOrdersByUser()
   * addReviewByUser()
   * updateReviewByIdByUser()
   * filterOrderList()
   * onRatingChanged()
   * onSubmitReview()
   */
  private getAllOrdersByUser() {
    this.loader = true;

    const mSelect = {
      orderItem: 1,
      orderType: 1,
      orderStatus: 1,
      expiredIn: 1,
      liveCourseCode: 1,
      liveGroupLink: 1,
      review: 1,
    };

    const filterData: FilterData = {
      filter: {
        ...this.filter,
        ...{ orderStatus: 'Delivered' },
      },
      select: mSelect,
      pagination: null,
      sort: { createdAt: -1 },
    };

    this.orderService.getAllOrdersByUser(filterData).subscribe({
      next: (res) => {
        const orders = res.data;
        this.orders = orders.map((m) => {
          return {
            ...m,
            review: m.review
              ? { _id: m.review._id || null, review: m.review.review || '', rating: m.review.rating || 0, name: m.review.name || '' }
              : { _id: null, review: '', rating: 0, name: '' },
          };
        });
        this.loader = false;
      },
      error: (err) => {
        console.log(err);
        this.loader = false;
      },
    });
  }

  private addReviewByUser(data: Order) {
    const mData = {
      // [CHANGED] Send name and phone as top-level fields
      name: data?.review?.name,
      phone: this.userPhone,
      order_id: data._id,
      course: {
        _id: data?.orderItem?._id,
        name: data?.orderItem?.name,
        slug: data?.orderItem?.slug,
        image: data?.orderItem?.image,
      },
      reviewDate: new Date(),
      review: data?.review?.review,
      rating: data?.review?.rating,
      status: 'draft',
    };

    this.reviewService.addReviewByUser(mData).subscribe({
      next: (res) => {
        this.uiService.success(res.message);
        // [NEW] Clear all fields after submit
        data.review = { _id: null, review: '', rating: 0, name: '' };
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private updateReviewByIdByUser(data: Order) {
    const mData = {
      // [CHANGED] Send name and phone as top-level fields
      name: data?.review?.name,
      phone: this.userPhone,
      order_id: data._id,
      review: data?.review?.review,
      rating: data?.review?.rating,
    };
    this.reviewService
      .updateReviewByIdByUser(data.review._id, mData)
      .subscribe({
        next: (res) => {
          this.uiService.success(res.message);
          // [NEW] Clear all fields after submit
          data.review = { _id: null, review: '', rating: 0, name: '' };
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  filterOrderList(type: string, filter: any) {
    this.filter = filter;
    this.selectedStatus = type;
    this.getAllOrdersByUser();
  }

  onRatingChanged(rating: number, index: number) {
    this.orders[index].review.rating = rating;
  }

  onSubmitReview(data: Order) {
    if (!data.review._id) {
      this.addReviewByUser(data);
    } else {
      this.updateReviewByIdByUser(data);
    }
  }
}
