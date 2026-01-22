import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from '../../../interfaces/common/order.interface';
import { FilterData } from '../../../interfaces/core/filter-data.interface';
import { OrderService } from '../../../services/common/order.service';
import { UiService } from '../../../services/core/ui.service';
import { UtilsService } from '../../../services/core/utils.service';
import { faAngleRight, faFilePdf, faPlay, faVideoCamera, faDownload } from '@fortawesome/free-solid-svg-icons';
import {GroupLinkComponent} from '../group-link/group-link.component';
import {MatDialog} from '@angular/material/dialog';
import {CourseService} from '../../../services/common/course.service';

@Component({
  selector: 'app-my-enroll',
  templateUrl: './my-enroll.component.html',
  styleUrls: ['./my-enroll.component.scss'],
})
export class MyEnrollComponent implements OnInit {
  // Font Awesome Icon
  faAngleRight = faAngleRight;
  faVideoCamera = faVideoCamera;
  faFilePdf = faFilePdf;
  faPlay = faPlay;
  faDownload = faDownload;

  // Store Data
  private filter: any;
  orders: Order[] = [];
  selectedStatus = 'all';

  // Loader
  loader: boolean = false;

  // Store latest course specifications by courseId
  latestCourseSpecs: { [courseId: string]: any[] } = {};

  // Inject
  private readonly orderService = inject(OrderService);
  private readonly courseService = inject(CourseService);
  private readonly utilsService = inject(UtilsService);
  private readonly uiService = inject(UiService);
  private readonly router = inject(Router);
  private readonly dialog  = inject(MatDialog);

  ngOnInit() {
    // Base Data
    this.getAllOrdersByUser();
    // DEBUG: Log orders after fetching to inspect group link fields
    setTimeout(() => {
      console.log('DEBUG: orders data', this.orders);
    }, 2000);
  }

  /**
   * HTTP REQ HANDLE
   * getAllOrdersByUser()
   * filterOrderList()
   * checkExpireDay()
   * onCopyCode()
   * onPostName()
   */

  private getAllOrdersByUser() {
    this.loader = true;

    const mSelect = {
      orderItem: 1,
      orderType: 1,
      orderStatus: 1,
      expiredIn: 1,
      liveCourseCode: 1,
      specifications:1,
      liveGroupLink: 1,
      certificateImage: 1,
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
        this.orders = res.data;
        this.loader = false;
        this.fetchLatestCourseSpecs();
      },
      error: (err) => {
        console.log(err);
        this.loader = false;
      },
    });
  }

  private fetchLatestCourseSpecs() {
    this.orders.forEach(order => {
      const courseId = order?.orderItem?._id;
      if (courseId && !(courseId in this.latestCourseSpecs)) {
        this.courseService.getCourseForPreviewByUser(courseId, 'specifications')
          .subscribe({
            next: (res) => {
              this.latestCourseSpecs[courseId] = res.data?.specifications || [];
            },
            error: (err) => {
              this.latestCourseSpecs[courseId] = [];
            }
          });
      }
    });
  }

  public getCourseForPreviewByUser(id: string) {
    const select = 'specifications';
    this.courseService
      .getCourseForPreviewByUser(id, select)
      .subscribe({
        next: (res) => {
          this.openConfirmDialog('group-link', res.data?.specifications)
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

  checkExpireDay(expiredIn: any) {
    if (!expiredIn) {
      return null;
    }
    return this.utilsService.getDateDifference(
      new Date(expiredIn),
      new Date(),
      'days'
    );
  }

  onCopyCode(event: any) {
    event.stopPropagation();
    this.uiService.success('Code copied.');
  }

  onPostName(id: string, data: string) {
    console.log(id);
    this.router.navigate(['/', 'course-play-list', id]);
  }

  /**
   * downloadCertificate
   * Downloads a certificate image from a given URL. Uses fetch->blob to avoid
   * navigation and to support cross-origin downloads when permitted.
   */
  async downloadCertificate(url?: string, filename?: string, event?: MouseEvent) {
    try {
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }
      if (!url) {
        this.uiService.warn('Certificate image not available.');
        return;
      }

      const safeName = (filename || 'certificate')
        .toString()
        .replace(/[^a-z0-9\-_. ]/gi, '_')
        .trim() || 'certificate';

      // Try to fetch as blob
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) {
        // Fallback: open in new tab if direct fetch fails
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.click();
        return;
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      // Try to infer extension from blob type
      const ext = blob.type.split('/')[1] || 'png';
      a.download = `${safeName}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (e) {
      console.error('downloadCertificate error', e);
      // As a last resort, open the URL directly
      if (url) {
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.click();
      }
    }
  }

  /**
   * COMPONENT DIALOG VIEW
   */
  public openConfirmDialog(type: string, data?: any) {
    if (type === 'group-link') {
      const dialogRef = this.dialog.open(GroupLinkComponent, {
        maxWidth: '600px',
        width: '96%',
        data: data
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        // if (dialogResult) {
        //   this.deleteMultipleCourseById();
        // }
      });
    }

  }







}
