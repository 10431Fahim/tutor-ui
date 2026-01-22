import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Review } from 'src/app/interfaces/common/review.interface';
import { FilterData } from 'src/app/interfaces/core/filter-data.interface';
import { ReviewService } from 'src/app/services/common/review.service';

@Component({
  selector: 'app-community-area',
  templateUrl: './community-area.component.html',
  styleUrls: ['./community-area.component.scss']
})
export class CommunityAreaComponent implements OnInit, OnDestroy {

  // Store Data
  reviews: Review[] = [];

  // Subscriptions
  private subGetData: Subscription;

  // Inject
  private readonly reviewService = inject(ReviewService);


  ngOnInit(): void {
    // Base Data
    this.getAllReviews();
  }

  /**
   * HTTP REQUEST HANDLE
   * getAllReviews()
   */
  // private getAllReviews() {
  //   const mSelect = {
  //     user: 1,
  //     course: 1,
  //     review: 1,
  //     rating: 1,
  //     status: 1,
  //   }
  //   const filterData: FilterData = {
  //     select: mSelect,
  //     filter: { status: 'publish' },
  //     pagination: null,
  //     sort: { createdAt: -1 }
  //   }
  //   this.subGetData = this.reviewService.getAllReviews(filterData)
  //     .subscribe({
  //       next: res => {
  //         this.reviews = res.data;
  //       },
  //       error: err => {
  //         console.log(err)
  //       }
  //     })
  // }


  private getAllReviews() {
    this.reviewService.getAllReview().subscribe({
      next: (res) => {
        this.reviews = res.data;
      },
      error: (err) => {
        console.log(err)
      },
    });
  }
  /**
   * On Destroy
   */
  ngOnDestroy(): void {
    if (this.subGetData) {
      this.subGetData.unsubscribe();
    }
  }


}
