import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdditionalPageService } from '../../services/core/additional-page.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-extra-page-view',
  templateUrl: './additional-page-view.component.html',
  styleUrls: ['./additional-page-view.component.scss']
})
export class AdditionalPageViewComponent implements OnInit, OnDestroy {

  // Store Data
  slug: string = null;
  pageInfo: any = '';
  msg = '';

  // Subscriptions
  private subGetData: Subscription;
  private subRouteOne: Subscription;

  // Inject
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly additionalPageService = inject(AdditionalPageService);


  ngOnInit(): void {
    // GET DATA FROM PARAM
    this.subRouteOne = this.activatedRoute.paramMap.subscribe(param => {
      this.slug = param.get('pageSlug');
      this.getPageInfo();
    });
  }

  /**
   * HTTP REQ HANDLE
   * getPageInfo()
   */
  private getPageInfo() {
    this.subGetData = this.additionalPageService.getAdditionalPageBySlug(this.slug).subscribe({
      next: (res => {
        this.pageInfo = res.data;
        if (!this.pageInfo) {
          this.msg = '<h2>Coming Soon!</h2>'
        }
      }),
      error: err => {
        console.log(err);
      }
    });
  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    if (this.subRouteOne) {
      this.subRouteOne.unsubscribe();
    }
    if (this.subGetData) {
      this.subGetData.unsubscribe();
    }
  }

}
