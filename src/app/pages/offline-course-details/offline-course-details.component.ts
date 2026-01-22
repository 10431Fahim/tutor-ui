import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {faCalendar} from "@fortawesome/free-solid-svg-icons";
import {OfflineCourse} from "../../interfaces/common/offline-course.interface";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {OfflineCourseService} from "../../services/common/offline-course.service";
import {FilterData} from "../../interfaces/core/filter-data.interface";

@Component({
  selector: 'app-offline-course-details',
  templateUrl: './offline-course-details.component.html',
  styleUrls: ['./offline-course-details.component.scss']
})
export class OfflineCourseDetailsComponent implements OnInit, OnDestroy {

  faCalender = faCalendar

  // Store Data
  offlineCourse: OfflineCourse[]=[];
  id: string | any;
  slugData: string | any;

  // Loader
  isLoading = false;

  // Subscriptions
  private subParamData: Subscription;
  private subGetData: Subscription;

  // Inject
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly offlineCourseService = inject(OfflineCourseService);


  ngOnInit(): void {
    // // GET ID FROM PARAM
    // this.subParamData = this.activatedRoute.paramMap.subscribe(res => {
    //   this.id = res.get('id');
    //   if (this.id) {
    //     // this.getOfflineCourseById(this.id);
    //     this.getAllOfflineCourse();
    //   }
    // })


    this.subParamData = this.activatedRoute.queryParamMap.subscribe((qParam) => {
      this.slugData = qParam.get('subCategory');
      // console.log('this.slugData',this.slugData)
      if (this.slugData) {
        this.getAllOfflineCourse();
      }
    });

  }

  /**
   * HTTP REQUEST HANDLE
   * getOfflineCourseById()
   */
  // getOfflineCourseById(id: string | any) {
  //   this.isLoading = true;
  //   this.subGetData = this.offlineCourseService.getOfflineCourseById(id).subscribe({
  //     next: res => {
  //       this.offlineCourse = res.data;
  //       this.isLoading = false;
  //     },
  //     error: err => {
  //       console.log(err);
  //       this.isLoading = true;
  //     }
  //   })
  // }


  /**
   * HTTP REQUEST HANDLE
   * getAllBlogs()
   */
  getAllOfflineCourse() {
    let mSelect = {
      name: 1,
      shortDesc: 1,
      image: 1,
      description: 1,
      createdAt: 1,
    }

    const filterData: FilterData = {
      filter: {'subCategory.slug': this.slugData},
      select: mSelect,
      pagination: null,
      sort: { createdAt: -1 }
    }

    this.isLoading = true;
    this.subGetData = this.offlineCourseService.getAllOfflineCourses(filterData, null).subscribe({
        next: res => {
          if (res.success) {
            this.offlineCourse = res.data;
            // console.log('this.offlineCourse',this.offlineCourse);
            this.isLoading = false;
            // this.totalProducts = res.count;
          }
        },
        error: err => {
          console.log(err);
        }
      }
    )
  }



  /**
   * On Destroy
   */
  ngOnDestroy(): void {
    if (this.subGetData) {
      this.subGetData.unsubscribe();
    }
    if (this.subParamData) {
      this.subParamData.unsubscribe();
    }
  }
}
