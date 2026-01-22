import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Notice} from "../../interfaces/common/notice.interface";
import {Subscription} from "rxjs";
import {NoticeService} from "../../services/common/notice.service";
import {FilterData} from "../../interfaces/core/filter-data.interface";

@Component({
  selector: 'app-all-notice',
  templateUrl: './all-notice.component.html',
  styleUrls: ['./all-notice.component.scss']
})
export class AllNoticeComponent implements OnInit, OnDestroy {

  // Store Data
  notices: Notice[];
  isLoadingNotice: boolean = true;

  // Pagination
  currentPage = 1;
  totalProducts: number;
  productsPerPage = 10;

  // Subscriptions
  private subGetData: Subscription;

  // Inject
  private readonly noticeService = inject(NoticeService);


  ngOnInit(): void {
    // Base Data
    this.getAllNotices();
  }

  /**
   * HTTP REQUEST HANDLE
   * getAllNotices()
   */
  getAllNotices() {
    let mSelect = {
      name: 1,
      status: 1,
      shortDesc: 1,
      image: 1,
      createdAt: 1,
    }

    const filterData: FilterData = {
      filter: null,
      select: mSelect,
      pagination: null,
      sort: { createdAt: -1 }
    }

    this.isLoadingNotice = true;
    this.subGetData = this.noticeService.getAllNotice(filterData, null).subscribe({
        next: res => {
          if (res.success) {
            this.notices = res.data;
            this.isLoadingNotice = false;
            this.totalProducts = res.count;
          }
        },
        error: err => {
          console.log(err);
        }
      }
    )
  }

  /**
   * ON PAGINATION CHANGE
   * onPageChanged()
   */
  onPageChanged(event: number) {
    this.currentPage = event;
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
