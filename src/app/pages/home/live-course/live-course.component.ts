import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {CourseService} from 'src/app/services/common/course.service';
import {Course} from '../../../interfaces/common/course.interface';
import {PricePipe} from '../../../shared/pipes/price.pipe';
import {RAW_SRC} from '../../../core/utils/app-data';
import {faVideoCamera} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-live-course',
  templateUrl: './live-course.component.html',
  styleUrls: ['./live-course.component.scss'],
  providers: [PricePipe],
})
export class LiveCourseComponent
  implements OnInit, OnDestroy
{
  // Font Awesome Icon
  faVideoCamera = faVideoCamera;

  // Store Data
  courses: Course[] = [];

  // Static Data
  readonly rawSrcset = RAW_SRC;

  // Subscriptions
  private subGetData: Subscription;

  // Inject
  private readonly courseService = inject(CourseService);
  private readonly pricePipe = inject(PricePipe);

  ngOnInit(): void {
    // Base Data
    this.getAllCourses();
  }

  /**
   * HTTP REQUEST HANDLE
   * getAllCourses()
   */

  // private getAllCourses() {
  //   const mSelect = {
  //     name: 1,
  //     slug: 1,
  //     bannerImage: 1,
  //     isFeatured: 1,
  //     salePrice: 1,
  //     discountAmount: 1,
  //     discountType: 1,
  //     type: 1,
  //     isMultiplePrice: 1,
  //     prices: 1,
  //   };
  //
  //   const pagination: Pagination = {
  //     pageSize: 10,
  //     currentPage: 0,
  //   };
  //
  //   const filterData: FilterData = {
  //     select: mSelect,
  //     pagination: pagination,
  //     filter: { type: 'live-course', status: 'publish' },
  //     sort: { createdAt: -1 },
  //   };
  //
  //   this.subGetData = this.courseService.getAllCourses(filterData).subscribe({
  //     next: (res) => {
  //       this.courses = res.data;
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //   });
  // }

  /**
   * HTTP REQUEST HANDLE
   * getAllCourses()
   */

  private getAllCourses() {
    this.courseService.getAllCoursesByUi({status: 'publish', type: 'live-course'}, 1, 12).subscribe({
      next: (res) => {
        this.courses = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**
   * CHECK DISCOUNT
   * checkDiscount()
   */

  checkDiscount(data: Course): boolean {
    const salePrice = this.pricePipe.transform(
      data,
      'salePrice',
      data.isMultiplePrice ? data[0] : null
    );
    const regularPrice = this.pricePipe.transform(
      data,
      'regularPrice',
      data.isMultiplePrice ? data[0] : null
    );
    return salePrice !== regularPrice;
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
