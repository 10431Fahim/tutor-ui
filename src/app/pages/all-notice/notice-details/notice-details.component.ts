import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {faCalendar} from "@fortawesome/free-solid-svg-icons";
import {Notice} from "../../../interfaces/common/notice.interface";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {NoticeService} from "../../../services/common/notice.service";

@Component({
  selector: 'app-notice-details',
  templateUrl: './notice-details.component.html',
  styleUrls: ['./notice-details.component.scss']
})
export class NoticeDetailsComponent implements OnInit, OnDestroy {

  faCalender = faCalendar

  // Store Data
  notice: Notice;
  id: string | any;

  // Loader
  isLoading = false;

  // Subscriptions
  private subParamData: Subscription;
  private subGetData: Subscription;

  // Inject
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly noticeService = inject(NoticeService);


  ngOnInit(): void {
    // GET ID FROM PARAM
    this.subParamData = this.activatedRoute.paramMap.subscribe(res => {
      this.id = res.get('id');
      if (this.id) {
        this.getNoticeById(this.id);
      }
    })
  }

  /**
   * HTTP REQUEST HANDLE
   * getNoticeById()
   */
  getNoticeById(id: string | any) {
    this.isLoading = true;
    this.subGetData = this.noticeService.getNoticeById(id).subscribe({
      next: res => {
        this.notice = res.data;
        this.isLoading = false;
      },
      error: err => {
        console.log(err);
        this.isLoading = true;
      }
    })
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
