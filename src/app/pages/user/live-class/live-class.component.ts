import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LiveClassService } from '../../../services/common/live-class.service';
import { OrderService } from '../../../services/common/order.service';
import { UserDataService } from '../../../services/common/user-data.service';
import { UiService } from '../../../services/core/ui.service';
import { LiveClass } from '../../../interfaces/common/live-class.interface';
import { Order } from '../../../interfaces/common/order.interface';
import { User } from '../../../interfaces/common/user.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-live-class',
  templateUrl: './live-class.component.html',
  styleUrls: ['./live-class.component.scss'],
})
export class LiveClassComponent implements OnInit, OnDestroy {
  // Store Data
  liveClasses: LiveClass[] = [];
  enrolledCourses: Order[] = [];
  user: User | any = null;
  selectedCourseId: string = '';
  selectedLiveClass: LiveClass | null = null;

  // Loader
  isLoading = false;

  // Subscriptions
  private subGetLiveClasses: Subscription;
  private subGetCourses: Subscription;
  private subGetUser: Subscription;
  private subJoin: Subscription;

  // Inject
  private readonly liveClassService = inject(LiveClassService);
  private readonly orderService = inject(OrderService);
  private readonly userDataService = inject(UserDataService);
  private readonly uiService = inject(UiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  ngOnInit() {
    this.getUserData();
    this.getAllEnrolledCourses();
    this.route.queryParams.subscribe((params) => {
      if (params['courseId']) {
        this.selectedCourseId = params['courseId'];
        this.getLiveClassesByCourse();
      }
    });
  }

  ngOnDestroy() {
    if (this.subGetLiveClasses) {
      this.subGetLiveClasses.unsubscribe();
    }
    if (this.subGetCourses) {
      this.subGetCourses.unsubscribe();
    }
    if (this.subGetUser) {
      this.subGetUser.unsubscribe();
    }
    if (this.subJoin) {
      this.subJoin.unsubscribe();
    }
  }

  private getUserData() {
    this.subGetUser = this.userDataService.getLoggedInUserData().subscribe({
      next: (res) => {
        this.user = res.data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  private getAllEnrolledCourses() {
    this.isLoading = true;
    const filterData = {
      filter: { orderStatus: 'Delivered' },
      pagination: null,
      sort: { createdAt: -1 },
    };
    this.subGetCourses = this.orderService.getAllOrdersByUser(filterData).subscribe({
      next: (res) => {
        this.enrolledCourses = res.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  getLiveClassesByCourse() {
    if (!this.selectedCourseId) {
      return;
    }
    this.isLoading = true;
    this.subGetLiveClasses = this.liveClassService
      .getAllLiveClasses({ courseId: this.selectedCourseId } as any)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.liveClasses = res.data.data || [];
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
  }

  onCourseSelect(courseId: string) {
    this.selectedCourseId = courseId;
    this.getLiveClassesByCourse();
  }

  joinLiveClass(liveClass: LiveClass) {
    if (!this.user?._id) {
      this.uiService.warn('Please login to join live class');
      return;
    }

    this.subJoin = this.liveClassService.joinLiveClass(liveClass._id, this.user._id).subscribe({
      next: (res) => {
        if (res.success) {
          this.uiService.success('Joined live class successfully');
          if (liveClass.meetingUrl) {
            window.open(liveClass.meetingUrl, '_blank');
          }
          this.getLiveClassesByCourse();
        }
      },
      error: (err) => {
        console.log(err);
        this.uiService.warn('Failed to join live class');
      },
    });
  }

  viewRecordedClass(recordedUrl: string) {
    if (recordedUrl) {
      window.open(recordedUrl, '_blank');
    }
  }

  isUpcoming(scheduledDateTime: Date | string): boolean {
    const scheduled = new Date(scheduledDateTime);
    return scheduled > new Date();
  }

  isLive(scheduledDateTime: Date | string, status: string): boolean {
    if (status === 'live') return true;
    const scheduled = new Date(scheduledDateTime);
    const now = new Date();
    const diff = now.getTime() - scheduled.getTime();
    return diff >= 0 && diff < 2 * 60 * 60 * 1000; // Within 2 hours
  }
}

