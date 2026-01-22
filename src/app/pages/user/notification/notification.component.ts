import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { NotificationService } from '../../../services/common/notification.service';
import { OrderService } from '../../../services/common/order.service';
import { UserDataService } from '../../../services/common/user-data.service';
import { UiService } from '../../../services/core/ui.service';
import { Notification } from '../../../interfaces/common/notification.interface';
import { Order } from '../../../interfaces/common/order.interface';
import { User } from '../../../interfaces/common/user.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit, OnDestroy {
  // Store Data
  notifications: Notification[] = [];
  enrolledCourses: Order[] = [];
  user: User | any = null;
  selectedFilter: 'all' | 'course' | 'general' | 'circular' = 'all';

  // Loader
  isLoading = false;

  // Subscriptions
  private subGetNotifications: Subscription;
  private subGetCourses: Subscription;
  private subGetUser: Subscription;

  // Inject
  private readonly notificationService = inject(NotificationService);
  private readonly orderService = inject(OrderService);
  private readonly userDataService = inject(UserDataService);
  private readonly uiService = inject(UiService);

  ngOnInit() {
    this.getUserData();
    this.getAllEnrolledCourses();
    this.getAllNotifications();
  }

  ngOnDestroy() {
    if (this.subGetNotifications) {
      this.subGetNotifications.unsubscribe();
    }
    if (this.subGetCourses) {
      this.subGetCourses.unsubscribe();
    }
    if (this.subGetUser) {
      this.subGetUser.unsubscribe();
    }
  }

  private getUserData() {
    this.subGetUser = this.userDataService.getLoggedInUserData().subscribe({
      next: (res) => {
        this.user = res.data;
        if (this.user?._id) {
          this.getAllNotifications();
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  private getAllEnrolledCourses() {
    const filterData = {
      filter: { orderStatus: 'Delivered' },
      pagination: null,
      sort: { createdAt: -1 },
    };
    this.subGetCourses = this.orderService.getAllOrdersByUser(filterData).subscribe({
      next: (res) => {
        this.enrolledCourses = res.data || [];
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getAllNotifications() {
    this.isLoading = true;
    
    // Get all notifications
    const filterData: any = {
      filter: {},
      pagination: {
        currentPage: 1,
        pageSize: 100,
      },
    };

    this.subGetNotifications = this.notificationService.getAllNotifications(filterData).subscribe({
      next: (res: any) => {
        if (res && res.success) {
          let allNotifications: Notification[] = [];
          
          // Extract data from different response structures
          if (Array.isArray(res.data)) {
            allNotifications = res.data;
          } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
            allNotifications = res.data.data;
          } else if (res.data && typeof res.data === 'object') {
            // Try to find array in the object
            const keys = Object.keys(res.data);
            for (const key of keys) {
              if (Array.isArray(res.data[key])) {
                allNotifications = res.data[key];
                break;
              }
            }
          }
          
          // Filter notifications based on user and enrolled courses
          if (this.user?._id) {
            const courseIds = this.enrolledCourses.map((order) => {
              const courseId = order?.orderItem?._id;
              return courseId ? String(courseId) : null;
            }).filter(id => id !== null);
            
            allNotifications = allNotifications.filter((notification: Notification) => {
              // Only show sent notifications (not draft)
              if (notification.status !== 'sent') {
                return false;
              }
              
              // Filter by type if selected
              if (this.selectedFilter !== 'all' && notification.type !== this.selectedFilter) {
                return false;
              }
              
              // Check if notification should be visible to this user
              if (notification.targetAudience === 'all') {
                return true; // Show to all users
              }
              
              if (notification.targetAudience === 'course-students') {
                // Show if user is enrolled in the course
                const notifCourseId = notification.courseId?._id || notification.courseId;
                if (notifCourseId && courseIds.includes(String(notifCourseId))) {
                  return true;
                }
                return false;
              }
              
              if (notification.targetAudience === 'specific-students') {
                // Show if user is in targetUserIds
                const targetIds = notification.targetUserIds || [];
                const userIdStr = String(this.user._id);
                if (targetIds.some((id: any) => String(id?._id || id) === userIdStr)) {
                  return true;
                }
                return false;
              }
              
              // For other cases, don't show
              return false;
            });
          } else {
            // If no user, show only sent notifications with type filter
            allNotifications = allNotifications.filter((notification: Notification) => {
              if (notification.status !== 'sent') {
                return false;
              }
              if (this.selectedFilter !== 'all') {
                return notification.type === this.selectedFilter;
              }
              return true;
            });
          }
          
          this.notifications = allNotifications;
        } else {
          this.notifications = [];
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching notifications:', err);
        this.notifications = [];
        this.isLoading = false;
      },
    });
  }

  onFilterChange(filter: string) {
    this.selectedFilter = filter as any;
    this.getAllNotifications();
  }

  downloadCircular(circularFile: string) {
    if (circularFile) {
      window.open(circularFile, '_blank');
    }
  }

  isRead(notification: Notification): boolean {
    if (!this.user?._id || !notification.isRead || !Array.isArray(notification.isRead)) {
      return false;
    }
    const userIdStr = String(this.user._id);
    return notification.isRead.some((read) => {
      if (!read || !read.userId) {
        return false;
      }
      // Handle both string and object userId
      const readUserId = typeof read.userId === 'object' && read.userId !== null 
        ? (read.userId as any)._id || read.userId 
        : read.userId;
      return String(readUserId) === userIdStr;
    });
  }

  markAsRead(notification: Notification) {
    if (!this.user?._id || !notification._id) {
      return;
    }

    if (this.isRead(notification)) {
      return; // Already read
    }

    this.notificationService.markAsRead(notification._id, this.user._id).subscribe({
      next: (res) => {
        if (res.success) {
          // Update local notification
          if (!notification.isRead) {
            notification.isRead = [];
          }
          notification.isRead.push({
            userId: this.user._id,
            readAt: new Date(),
          });
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}

