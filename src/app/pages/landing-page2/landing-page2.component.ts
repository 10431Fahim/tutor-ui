import {Component, ElementRef, inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TopSectionComponent} from './top-section/top-section.component';
import {FaqComponent} from './faq/faq.component';
import {OurProductComponent} from './our-product/our-product.component';
import {FooterComponent} from './footer/footer.component';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {isPlatformBrowser, NgIf} from "@angular/common";
import {UtilsService} from "../../services/core/utils.service";
import {SocialChatComponent} from "./social-chat/social-chat.component";
import {Meta, Title} from "@angular/platform-browser";
import {LazyLoadComponentDirective} from "../../shared/directives/lazy-load-component.directive";
import {ReloadService} from "../../services/core/reload.service";
import {YoutubeVideoComponent} from "./youtube-video/youtube-video.component";
import {CustomerReviewComponent} from "./customer-review/customer-review.component";
import {HelpingComponent} from "./helping/helping.component";
import {WhyBuyProductComponent} from "./why-buy-product/why-buy-product.component";
import {PaymentAreaComponent} from "./payment-area/payment-area.component";
import {PricePipe} from "../../shared/pipes/price.pipe";
import {ShopInformationService} from "../../services/common/shop-information.service";
import {ShopInformation} from "../../interfaces/common/shop-information.interface";
import {UserService} from '../../services/common/user.service';
import {CanonicalService} from "../../services/common/canonical.service";
import {LandingPageService} from "../../services/common/landing-page.service";

@Component({
  selector: 'app-landing-page2',
  templateUrl: './landing-page2.component.html',
  styleUrls: ['./landing-page2.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    TopSectionComponent,
    FaqComponent,
    OurProductComponent,
    FooterComponent,
    SocialChatComponent,
    LazyLoadComponentDirective,
    NgIf,
    YoutubeVideoComponent,
    CustomerReviewComponent,
    HelpingComponent,
    WhyBuyProductComponent,
    PaymentAreaComponent,
    LazyLoadComponentDirective,
  ],
  providers: [PricePipe],
})
export class LandingPage2Component implements OnInit, OnDestroy {
  @ViewChild('payment') mainEl!: ElementRef;

  singleLandingPage: any;
  slug?: string;
  quantity = 1;
  private eventId: string;
  product: any;
  chatLink: any;
  showLazyComponent: string[] = [];
  selectedVariationList: any = null;
  productData: any;
  selectedVariation: string = null;
  selectedVariation2: string = null;
  carts: any[] = [];
  shopInfo: ShopInformation;
  websiteInfo: any;
  cartSaleSubTotal: any;
  private hasFiredViewContent = false;
  // Store Data
  protected readonly rawSrcset: string = '384w, 640w';

  // Inject
  private readonly landingPageService = inject(LandingPageService);
  private readonly activateRoute = inject(ActivatedRoute);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly utilsService = inject(UtilsService);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly canonicalService = inject(CanonicalService);
  private readonly reloadService = inject(ReloadService);
  private readonly shopInfoService = inject(ShopInformationService);
  private readonly userService = inject(UserService);
  private readonly pricePipe = inject(PricePipe);
  // Subscriptions
  private subscriptions: Subscription[] = [];

  ngOnInit() {
// Param Map
    const subscription = this.activateRoute.paramMap.subscribe((param) => {
      this.slug = param.get('slug');
      if (this.slug) {
        this.getOfferBySlug();
      }
    });

    this.subscriptions?.push(subscription);
    if (isPlatformBrowser(this.platformId)) {
      this.getShopInfo();
    }

    if (this.product?.isVariation) {
      this.setDefaultVariation();
    }

    this.reloadService.refreshSticky$.subscribe((res) => {
      if (res) {
        this.showLazyComponent = ['sec1', 'sec2', 'sec3', 'sec4', 'sec5', 'sec6', 'sec7', 'sec8', 'sec9', 'sec10'];
        setTimeout(() => {
          this.onScrollSection();
        }, 50);
      }
    });


  }


  private getOfferBySlug() {
    const subscription = this.landingPageService
      .getLandingBySlug(this.slug)
      .subscribe({
        next: res => {
          this.singleLandingPage = res?.data;
          console.log('this.singleLandingPage',this.singleLandingPage)
          this.product = res?.data?.product;
          this.updateMetaData();
          // View Content Event
          // if (isPlatformBrowser(this.platformId)) {
          //   this.viewContentEvent();
          // }
        },
        error: err => {
          console.log(err);
        },
      });
    this.subscriptions?.push(subscription);
  }



  /**
   * HTTP REQUEST CONTROLL
   * addNewsLetter()
   * getShopInfo()
   */

  private getShopInfo() {
    const subscription = this.shopInfoService.getShopInformation().subscribe({
      next: res => {
        this.shopInfo = res.data;
      },
      error: err => {
        console.error(err);
      }
    });
    this.subscriptions?.push(subscription);
  }




  private setDefaultVariation() {
    if (this.product?.variation) {
      this.selectedVariation = this.product?.variationOptions[0];
    }
    if (this.product?.variation2) {
      this.selectedVariation2 = this.product?.variation2Options[0];
    }
    this.setSelectedVariationList();
  }

  private setSelectedVariationList() {
    if (this.selectedVariation && this.selectedVariation2) {
      this.selectedVariationList = this.product?.variationList.find(
        f => f.name === `${this.selectedVariation}, ${this.selectedVariation2}`
      );
    } else {
      this.selectedVariationList = this.product?.variationList.find(f => f.name === `${this.selectedVariation}`)
    }
  }

  /**
   * updateMetaData()
   */

  private updateMetaData() {
    // Extract product information for reuse
    const seoTitle = this.singleLandingPage?.title;
    const seoDescription = this.singleLandingPage?.description;
    const imageUrl = this.singleLandingPage?.image; // Default to an empty string if no image is available
    const url = ``;
    // Title
    this.title.setTitle(seoTitle);

    // Meta Tags
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#01640D'});
    this.meta.updateTag({name: 'description', content: seoDescription});

    // Open Graph (og:)
    this.meta.updateTag({property: 'og:title', content: seoTitle});
    this.meta.updateTag({property: 'og:type', content: 'website'});
    this.meta.updateTag({property: 'og:url', content: url});
    this.meta.updateTag({property: 'og:image', content: imageUrl});
    this.meta.updateTag({property: 'og:image:type', content: 'image/jpeg'});
    this.meta.updateTag({property: 'og:image:width', content: '1200'}); // Recommended width
    this.meta.updateTag({property: 'og:image:height', content: '630'}); // Recommended height
    this.meta.updateTag({property: 'og:description', content: seoDescription});
    this.meta.updateTag({property: 'og:locale', content: 'en_US'});

    // Twitter Tags
    this.meta.updateTag({name: 'twitter:title', content: seoTitle});
    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:description', content: seoDescription});
    this.meta.updateTag({name: 'twitter:image', content: imageUrl}); // Image for Twitter

    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: imageUrl});

    // Canonical
    this.canonicalService.setCanonicalURL();
  }


  /**
   * ON Lazy Component Load
   */
  loadNextComponent(type: 'sec1' | 'sec2' | 'sec3' | 'sec4' | 'sec5' | 'sec6' | 'sec7' | 'sec8' | 'sec9' | 'sec10') {
    this.showLazyComponent.push(type);
  }

  checkComponentLoad(type: 'sec1' | 'sec2' | 'sec3' | 'sec4' | 'sec5' | 'sec6' | 'sec7' | 'sec8' | 'sec9' | 'sec10'): boolean {
    const fIndex = this.showLazyComponent.findIndex(f => f === type);
    return fIndex !== -1;
  }



  onScrollSection(): void {
    const el = this.mainEl.nativeElement as HTMLDivElement;
    // Define a breakpoint for mobile devices (adjust as needed)
    const isMobile = window?.matchMedia('(max-width: 768px)').matches;

    // Use 'nearest' for mobile and 'center' for larger screens
    const alignment = isMobile ? 'nearest' : 'center';

    el.scrollIntoView({
      behavior: 'smooth',
      inline: alignment,
      block: alignment
    });
  }

  /**
   * ON Destroy
   */
  ngOnDestroy() {
    this.subscriptions?.forEach(sub => sub?.unsubscribe());
  }
}

