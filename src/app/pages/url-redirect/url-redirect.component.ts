import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {LinkShortener} from '../../interfaces/common/link-shortener.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {LinkShortenerService} from '../../services/common/link-shortener.service';
import {Subscription} from 'rxjs';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-url-redirect',
  templateUrl: './url-redirect.component.html',
  styleUrls: ['./url-redirect.component.scss']
})
export class UrlRedirectComponent implements OnInit, OnDestroy {

  private slug: string;
  private linkShortener: LinkShortener;

  // Subscriptions
  private subRoute: Subscription;
  private subDataOne: Subscription;
  private readonly document = inject(DOCUMENT);

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private linkShortenerService: LinkShortenerService,
  ) {
  }

  ngOnInit() {

    this.subRoute = this.activatedRoute.paramMap.subscribe(param => {
      this.slug = param.get('slug');
      if (this.slug) {
        this.getLinkShortenerBySlug();
      }
    })
  }

  /**
   * HTTP REQ HANDLE
   * getLinkShortenerBySlug()
   */

  private getLinkShortenerBySlug () {
    this.subDataOne = this.linkShortenerService.getLinkShortenerBySlug(this.slug)
      .subscribe({
        next: res => {
          if (res.data) {
            this.linkShortener = res.data;
            this.document.location.href = this.linkShortener.url;
          } else {
            this.router.navigate(['not-found']).then();
          }
        },
        error: err => {
          console.log(err);
        }
      })
  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    if (this.subRoute) {
      this.subRoute.unsubscribe();
    }

    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
  }

}
