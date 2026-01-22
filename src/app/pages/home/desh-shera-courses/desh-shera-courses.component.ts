import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {CourseService} from 'src/app/services/common/course.service';
import {Course} from '../../../interfaces/common/course.interface';

@Component({
  selector: 'app-desh-shera-courses',
  templateUrl: './desh-shera-courses.component.html',
  styleUrls: ['./desh-shera-courses.component.scss']
})
export class DeshSheraCoursesComponent implements OnInit, OnDestroy {

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
  //
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
  //     filter: { 'tag.name': 'Skill Development', status: 'publish' },
  //     sort: { priority: 1 }
  //
  //   }
  //
  //   this.subGetData = this.courseService.getAllCourses(filterData)
  //     .subscribe({
  //       next: res => {
  //         this.courses = res.data;
  //       },
  //       error: err => {
  //         console.log(err)
  //       }
  //     })
  // }

  /**
   * HTTP REQUEST HANDLE
   * getAllCourses()
   */

  private getAllCourses() {
    this.courseService.getAllCoursesByUi({'tag.name': 'Skill Development'}, 1, 6).subscribe({
      next: (res) => {
        this.courses = res.data;
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
