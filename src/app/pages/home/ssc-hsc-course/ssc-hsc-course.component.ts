import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FilterData } from 'src/app/interfaces/core/filter-data.interface';
import { CourseService } from 'src/app/services/common/course.service';
import { Course } from '../../../interfaces/common/course.interface';

@Component({
  selector: 'app-ssc-hsc-course',
  templateUrl: './ssc-hsc-course.component.html',
  styleUrls: ['./ssc-hsc-course.component.scss']
})
export class SscHscCourseComponent implements OnInit, OnDestroy {

  // Store Data
  courses: Course[] = [];

  // Subscriptions
  private subGetData: Subscription;

  // Inject
  private readonly courseService = inject(CourseService);

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
  //     totalClass: 1,
  //   }
  //
  //   const filterData: FilterData = {
  //     select: mSelect,
  //     pagination: { pageSize: 3, currentPage: 0 },
  //     filter: { 'tag.name': 'Important Free Class', status: 'publish' },
  //     sort: { priority: 1 }
  //   }
  //
  //   this.subGetData = this.courseService.getAllCourses(filterData).subscribe({
  //     next: res => {
  //       this.courses = res.data;
  //     },
  //     error: err => {
  //       console.log(err)
  //     }
  //   })
  // }

  /**
   * HTTP REQUEST HANDLE
   * getAllCourses()
   */

  // private getAllCourses() {
  //   this.courseService.getAllCoursesByUi({status: 'publish', 'tags.name': 'Important Free Class'}, 1, 4).subscribe({
  //     next: (res) => {
  //       this.courses = res.data;
  //       console.log("this.courses--- = ", this.courses);
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //   });
  // }

  private getAllCourses() {
    this.courseService.getAllCoursesByUi({status: 'publish',  'tag.name': 'Important Free Class'}, 1, 4).subscribe({
      next: (res) => {
        this.courses = res.data;
        console.log("this.courses =  for ss", this.courses);
      },
      error: (err) => {
        console.log(err);
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
