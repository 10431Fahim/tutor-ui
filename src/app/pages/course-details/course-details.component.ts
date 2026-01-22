import { DOCUMENT } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Order } from 'src/app/interfaces/common/order.interface';
import { ShopInformation } from 'src/app/interfaces/common/shop-information.interface';
import { User } from 'src/app/interfaces/common/user.interface';
import { Pagination } from 'src/app/interfaces/core/pagination.interface';
import { CanonicalService } from 'src/app/services/common/canonical.service';
import { CourseService } from 'src/app/services/common/course.service';
import { OrderService } from 'src/app/services/common/order.service';
import { ShopInformationService } from 'src/app/services/common/shop-information.service';
import { UserDataService } from 'src/app/services/common/user-data.service';
import { UserService } from 'src/app/services/common/user.service';
import { UtilsService } from 'src/app/services/core/utils.service';
import { YoutubeVideoShowComponent } from 'src/app/shared/dialog-view/youtube-video-show/youtube-video-show.component';
import { environment } from '../../../environments/environment';
import { Course, Price } from '../../interfaces/common/course.interface';
import { FilterData } from '../../interfaces/core/filter-data.interface';
import { PaymentService } from '../../services/common/payment.service';
import { UiService } from '../../services/core/ui.service';
import { PricePipe } from '../../shared/pipes/price.pipe';
import { ReviewService } from "../../services/common/review.service";
import { Review } from "../../interfaces/common/review.interface";
import {faAngleDown, faFilePdf, faPlay, faVideoCamera} from '@fortawesome/free-solid-svg-icons';
import {ConfirmDialogComponent} from "./confirm-dialog/confirm-dialog.component";
import {Coupon} from "../../interfaces/common/coupon.interface";
import {DiscountTypeEnum} from "../../enum/discount.enum";
import {CouponService} from "../../services/common/coupon.service";
import {PaymentDialogComponent} from "../../shared/dialog-view/payment-dialog/payment-dialog.component";
import { QnaService } from "../../services/common/qna.service";
import { QnA } from "../../interfaces/common/qna.interface";

@Component({
  selector: 'app-product-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss'],
  providers: [PricePipe],
})
export class CourseDetailsComponent implements OnInit, OnDestroy {
  // Font Awesome Icon
  faVideoCamera = faVideoCamera;
  faPlay = faPlay;
  faFilePdf = faFilePdf;
  url: string = ' ';
  coupon: Coupon = null;
  couponCode: string = null;
  couponDiscount: number = 0;
  // Store Data
  id?: string | any;
  isOnlySheet?: any;
  course?: Course;
  selectedPriceData: Price = null;
  shopInformation: ShopInformation[] | any = [];
  panelOpenState = false;
  isUser: boolean = false;
  isEnrolled: boolean = false;
  couponShowHide: boolean = false;
  relatedCourses: Course[] = [];
  user: User;
  reviews: Review[] = [];
  courseBanners: any[] = []; // For course banner carousel
  courseQnAs: QnA[] = []; // Q&A for this course
  // --- Added for description preview toggle ---
  showFullDescription = false;
  descriptionPreviewLength = 395;


  // --- Getter for description preview/full (for template use) ---
  get courseDescriptionPreview(): string {
    if (!this.course?.description) return '';
    // Remove HTML tags for preview using a simple regex
    const plainText = this.course.description.replace(/<[^>]+>/g, '');
    if (this.showFullDescription) return this.course.description;
    if (plainText.length > this.descriptionPreviewLength) {
      return plainText.slice(0, this.descriptionPreviewLength) + '...';
    }
    return plainText;
  }

  get courseDescriptionPreviewHtml(): string {
    if (!this.course?.description) return '';
    if (this.showFullDescription) return this.course.description;

    // Create a temporary element to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = this.course.description;

    let charCount = 0;
    let result = '';
    const maxLen = this.descriptionPreviewLength;

    function traverse(node: ChildNode): boolean {
      if (charCount >= maxLen) return false;
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || '';
        const remaining = maxLen - charCount;
        if (text.length > remaining) {
          result += text.slice(0, remaining);
          charCount += remaining;
          return false;
        } else {
          result += text;
          charCount += text.length;
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        // Preserve tag and attributes
        result += `<${el.tagName.toLowerCase()}${Array.from(el.attributes).map(attr => ` ${attr.name}="${attr.value}"`).join('')}>`;
        for (let i = 0; i < node.childNodes.length; i++) {
          if (!traverse.call(this, node.childNodes[i])) break;
        }
        result += `</${el.tagName.toLowerCase()}>`;
      }
      return charCount < maxLen;
    }

    for (let i = 0; i < tempDiv.childNodes.length; i++) {
      if (!traverse.call(this, tempDiv.childNodes[i])) break;
    }

    if (charCount >= maxLen) {
      result += '...';
    }
    return result;
  }

  // Loader
  isLoading: boolean = false;
  courseDetailLoader: boolean = false;

  // Subscriptions
  private subGetData1!: Subscription;
  private subGetData2!: Subscription;
  private subGetData3!: Subscription;
  private subGetData4!: Subscription;
  private subAddData1!: Subscription;
  private subRoute1!: Subscription;
  private subRoute2: Subscription;
  private subDataFive: Subscription;

  // Inject
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly courseService = inject(CourseService);
  private readonly reviewService = inject(ReviewService);
  private readonly shopInformationService = inject(ShopInformationService);
  private readonly uiService = inject(UiService);
  public readonly dialog = inject(MatDialog);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly canonicalService = inject(CanonicalService);
  private readonly userService = inject(UserService);
  private readonly userDataService = inject(UserDataService);
  private readonly paymentService = inject(PaymentService);
  private readonly router = inject(Router);
  private readonly orderService = inject(OrderService);
  private readonly couponService = inject(CouponService);
  private readonly utilService = inject(UtilsService);
  private readonly pricePipe = inject(PricePipe);
  private readonly document = inject(DOCUMENT);
  private readonly qnaService = inject(QnaService);


  ngOnInit(): void {
    this.url = window.location.href;
    // User Logged in Status
    this.isUser = this.userService.getUserStatus();
    this.userService.getUserStatusListener().subscribe((res) => {
      this.isUser = res;
      if (this.isUser) {
        this.getLoggedUserData();
      }
    });

    // GET DATA FROM PARAM
    this.subRoute1 = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      this.subRoute2 = this.activatedRoute.queryParamMap.subscribe((qParam) => {
        this.isOnlySheet = qParam.get('isOnlySheet');
        if (this.id) {
          this.getCourseBySlug();
        }
      });
    });

    // Base Data
    this.getLoggedUserData();
  }

  // --- Added: Toggle description preview/full ---
  toggleDescription() {
    this.showFullDescription = !this.showFullDescription;
  }
  // --- End added ---

  // --- Scroll to section method ---
  activeTab: string = 'class-start'; // Track active navigation tab
  
  scrollToSection(sectionId: string) {
    this.activeTab = sectionId;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  // --- End scroll to section ---

  // --- Collapsible Instructor Section ---
  showInstructorSection = false; // Controls visibility of instructor section
  toggleInstructorSection() {
    this.showInstructorSection = !this.showInstructorSection;
  }
  // --- End Collapsible Instructor Section ---

  // --- Instructor preview/collapse (card layout, not text) ---
  showAllInstructors = false;
  instructorPreviewCount = 1; // Show 1 by default, adjust as needed

  get instructorsToShow() {
    if (!this.course?.instructor) return [];
    if (this.showAllInstructors) return this.course.instructor;
    return this.course.instructor.slice(0, this.instructorPreviewCount);
  }

  get hasMoreInstructors() {
    return this.course?.instructor && this.course.instructor.length > this.instructorPreviewCount;
  }

  toggleInstructorList() {
    this.showAllInstructors = !this.showAllInstructors;
  }

  /**
   * HTTP REQ HANDLE
   * getCourseBySlug()
   * getCourseEnrollStatusByUser()
   * getAllReview()
   * getAllCourses()
   * getAllShopInformation()
   * getLoggedUserData()
   * addOrderByUser()
   * updateOrderByUserId()
   * onBuyCourse()
   */
  private getCourseBySlug() {
    this.courseDetailLoader = true;
    this.subGetData1 = this.courseService.getCourseById(this.id).subscribe({
      next: (res) => {
        const course = res.data;
        //Redirect if course is not published
        if (!course || course.status !== 'publish') {
          this.router.navigate(['/']);
          return;
        }
        // console.log("specifications",course)
        if (course) {
          if (course?.isMultiplePrice) {
            this.selectedPriceData = course?.prices[0];
          }
          if (this.isOnlySheet && course?.canSaleAttachment) {
            this.course = {
              ...course,
              ...{
                salePrice: course?.attachmentSalePrice,
                discountAmount: course?.attachmentDiscountAmount,
                discountType: course?.attachmentDiscountType,
                specifications: course?.specifications,
              },
            };
          } else {
            this.course = course;
          }

          if (this.isUser) {
            this.getCourseEnrollStatusByUser(this.id);
          }

          this.getAllCourses();
          this.courseDetailLoader = false;
          this.getAllReview();
          this.getCourseQnA(this.id);
        }
      },
      error: (err) => {
        console.log(err);
        this.courseDetailLoader = false;
      },
    });
  }

  private getCourseEnrollStatusByUser(id: string) {
    this.subGetData2 = this.courseService
      .getCourseEnrollStatusByUser(id)
      .subscribe({
        next: (res) => {
          if (res.success) {
            if (res.data.orderType === 'lecture-sheet') {
              this.isEnrolled = !!this.isOnlySheet;
            } else {
              this.isEnrolled = true;
            }
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  private getAllReview() {
    const mSelect = {
      course: 1,
      user: 1,
      reviewDate: 1,
      review: 1,
      rating: 1,
      priority: 1,
    };
    const filterData: FilterData = {
      select: mSelect,
      filter: { 'course.slug': this.course?.slug, status: 'publish' },
      pagination: { pageSize: 20, currentPage: 0 },
      sort: { createdAt: -1 },
    };

    this.subGetData1 = this.reviewService
      .getAllReviews(filterData, null)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.reviews = res.data;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  private getAllCourses() {
    const pagination: Pagination = {
      pageSize: 6,
      currentPage: 0,
    };

    const mSelect = {
      name: 1,
      salePrice: 1,
      discountType: 1,
      discountAmount: 1,
      bannerImage: 1,
      prices: 1,
      attachmentDiscountAmount: 1,
      attachmentDiscountType: 1,
      attachmentSalePrice: 1,
    };

    const filterData: FilterData = {
      pagination: pagination,
      filter: {status: 'publish'},
      select: mSelect,
      sort: { createdAt: -1 },
    };

    this.subGetData2 = this.courseService
      .getAllCourses(filterData, null)
      .subscribe({
        next: (res) => {
          this.relatedCourses = res.data.filter((filterData) => {
            return filterData._id !== this.course?._id;
          });
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  private getAllShopInformation() {
    const pagination: Pagination = {
      pageSize: 6,
      currentPage: 0,
    };

    const mSelect = {
      paymentVIdeoUrl: 1,
      phones: 1,
    };

    const filterData: FilterData = {
      pagination: pagination,
      filter: null,
      select: mSelect,
      sort: null,
    };
    this.subGetData3 = this.shopInformationService
      .getAllShopInformations(filterData, null)
      .subscribe({
        next: (res) => {
          this.shopInformation = res.data;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  private getLoggedUserData() {
    const select = 'name phone email';
    this.subGetData4 = this.userDataService
      .getLoggedInUserData(select)
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.user = res.data;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  private addOrderByUser(data: Order) {
    this.subAddData1 = this.orderService.addOrderByUser(data).subscribe({
      next: (res) => {
        if (res.success) {
          if (data.grandTotal > 0) {
            this.isLoading = false;
            // this.uiService.warnTop('Your course under checking. After checking added to your enroll list');
            if (res.data.link) {
              // 👉 SSLCommerz redirect for professional purchase
              this.document.location.href = res.data.link;
            }else {
              this.uiService.success('Course added to your enroll list');
              this.router.navigate(['/my-course']);
            }
            // this.bKashCreatePayment(data, res.data?._id);
          } else {
            this.uiService.warnTop('Course added to your enroll list');
            this.router.navigate(['/my-course']);
          }
        } else {
          this.uiService.warnTop(res.message);
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
        const status = err.status;

        if (+status === 409) {
          this.uiService.warnTop(err.error.message);
        } else {
          this.uiService.warnTop(err.message);
        }



      },
    });
  }

  private updateOrderByUserId(
    _id: string,
    data: any,
    paymentRedirectUrl: string
  ) {
    this.subAddData1 = this.orderService
      .updateOrderByUserId(_id, data)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.document.location.href = paymentRedirectUrl;
          } else {
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
  }

  public onBuyCourse() {
    this.isLoading = true;

    const mData: any = {
      name: this.user?.name,
      email: this.user?.email,
      phoneNo: this.user?.phone,
      paymentMethod: 'SSl Commerz',
      approveStatus: 'not-approved',
      paymentStatus:
        this.pricePipe.transform(
          this.course,
          'salePrice',
          this.selectedPriceData
        ) > 0
          ? 'unpaid'
          : 'paid',
      orderStatus:
        this.pricePipe.transform(
          this.course,
          'salePrice',
          this.selectedPriceData
        ) > 0
          ? 'Pending'
          : 'Delivered',
      subTotal: this.pricePipe.transform(
        this.course,
        'regularPrice',
        this.selectedPriceData
      ),
      discount: this.pricePipe.transform(
        this.course,
        'discountAmount',
        this.selectedPriceData
      ),

      grandTotal: this.coupon ? this.pricePipe.transform(
        this.course,
        'regularPrice',
        this.selectedPriceData
      ) - this.couponDiscount : this.pricePipe.transform(
        this.course,
        'salePrice',
        this.selectedPriceData
      ),
      paidAmount: 0,
      coupon: this.coupon ? this.coupon._id : null,
      couponDiscount: this.couponDiscount,
      checkoutDate: this.utilService.getDateString(new Date()),
      note: null,
      user: this.userService.getUserId(),
      orderType: this.isOnlySheet ? 'lecture-sheet' : this.course?.type,
      liveCourseCode: null,
      orderItem: {
        _id: this.course._id,
        name: this.course?.name,
        slug: this.course?.slug,
        type: this.isOnlySheet ? 'lecture-sheet' : this.course?.type,
        image: this.course?.bannerImage
          ? this.course?.bannerImage
          : this.course?.image,
        category: this.course?.category,
        subCategory: this.course?.subCategory,
        childCategory: this.course?.childCategory,
        specifications: this.course?.specifications,
        salePrice: this.pricePipe.transform(
          this.course,
          'salePrice',
          this.selectedPriceData
        ),
        discountType: this.course.isMultiplePrice
          ? this.selectedPriceData?.discountType
          : this.course.discountType,
        discountAmount: this.course.isMultiplePrice
          ? this.selectedPriceData?.discountAmount
          : this.course.discountAmount,
        unit: this.selectedPriceData
          ? {
              name: this.selectedPriceData?.name,
              duration: this.selectedPriceData?.duration,
            }
          : null,
      },
    };

    if (this.userService.getUserStatus()) {
      // this.openDialog(mData)
      this.addOrderByUser(mData);
    } else {
      this.isLoading = false;
      this.router
        .navigate(['/login'], {
          queryParams: { navigateFrom: this.router.url },
        })
        .then();
    }
  }


  openDialog(data:any) {
    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      data: { grantTotal: data?.grandTotal, bkashNumber: '01850989488' },
    });

    dialogRef.afterClosed().subscribe((result) => {

      if (result) {
        console.log('Dialog Data:', result);

        // API call
        const mData ={...data,...result}
        this.addOrderByUser(mData);
      }else {
        this.isLoading = false;
      }
    });
  }


  /**
   * COUPON HANDLE
   * checkCouponAvailability()
   * calculateCouponDiscount()
   * onRemoveCoupon()
   */

  public checkCouponAvailability() {
    if (!this.couponCode?.trim()) {
      this.uiService.warnTop('Please enter your vouchers code.');
      return;
    }
    if(this.userService.getUserStatus()){
      this.subDataFive = this.couponService
      .checkCouponAvailability({
        couponCode: this.couponCode,
        course: this.course._id,
        subTotal: this.pricePipe.transform(
          this.course,
          'regularPrice',
          this.selectedPriceData
        ),
      })
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.uiService.warnTop(res.message);
            this.coupon = res.data;
            // console.log(this.coupon);
            if (this.coupon) {
              this.calculateCouponDiscount();
            }
          } else {
            this.uiService.warnTop(res.message);
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
    }else{
      this.router.navigate(['/login'], {queryParams: {navigateFrom: this.router.url}, queryParamsHandling: 'merge'})
    }

  }

  private calculateCouponDiscount() {
    if (this.coupon.discountType === DiscountTypeEnum.PERCENTAGE) {
      this.couponDiscount = Math.floor(
        (this.coupon.discountAmount / 100) * this.pricePipe.transform(
          this.course,
          'regularPrice',
          this.selectedPriceData
        ),
      );
    } else {
      this.couponDiscount = Math.floor(this.coupon.discountAmount);
    }
  }

  onRemoveCoupon() {
    this.couponDiscount = 0;
    this.couponCode = null;
    this.coupon = null;
  }

  /**
   * PAYMENT API
   * bKashCreatePayment()
   */

  private bKashCreatePayment(orderData: Order, _id: string) {
    this.isLoading = true;

    const reqData = {
      mode: '0011',
      payerReference: ' ',
      callbackURL: environment.bkashCallbackUrl,
      amount: orderData.grandTotal,
      currency: 'BDT',
      intent: 'sale',
      merchantInvoiceNumber: _id, // Must be unique
    };

    this.paymentService.createBkashPayment(reqData).subscribe({
      next: (res) => {
        if (res.success) {
          const updateData = {
            paymentMethod: 'bKash',
            paymentApiType: 'bKash',
            paymentRefId: res.data.paymentID,
          };
          this.updateOrderByUserId(_id, updateData, res.data.bkashURL);
        } else {
          this.isLoading = false;
          this.uiService.warn('Something went wrong! Please try again.');
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  /**
   * DIALOG VIEW COMPONENT
   * openDialog()
   * openVideoPlayerDialog()
   */


  public openVideoPlayerDialog(url: string, isFree?: boolean) {
    if (url && isFree === true) {
      const dialogRef = this.dialog.open(YoutubeVideoShowComponent, {
        data: { url: url },
        panelClass: ['theme-dialog', 'no-padding-dialog'],
        width: '98%',
        maxWidth: '700px',
        height: 'auto',
        maxHeight: '100vh',
        autoFocus: false,
        disableClose: false,
      });
      dialogRef.afterClosed().subscribe((dialogResult) => {
        if (dialogResult && dialogResult.data) {
        }
      });
    } else {
      this.uiService.warnTop('Please enroll first');
    }
  }

  public openQuizPreview(quiz: any) {
    if (quiz && quiz._id) {
      // Navigate to quiz page or open quiz dialog
      this.router.navigate(['/quiz'], { queryParams: { quizId: quiz._id, courseId: this.id } });
    }
  }

  public openPdfPreview(url: string) {
    if (url) {
      window.open(url, '_blank');
    }
  }

  public openClassNotesPreview(module: any) {
    if (module?.classNotesFile) {
      window.open(module.classNotesFile, '_blank');
    } else if (module?.classNotesContent) {
      // Show class notes content in a dialog or alert
      alert(module.classNotesContent);
    }
  }

  private getCourseQnA(courseId: string) {
    const filterData: FilterData = {
      filter: { courseId: courseId, status: 'answered' },
      pagination: { pageSize: 50, currentPage: 1 },
      sort: { createdAt: -1 },
    };

    this.qnaService.getAllQna(filterData).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.courseQnAs = res.data;
        }
      },
      error: (err) => {
        console.log('Error fetching QnA:', err);
      },
    });
  }

  /**
   * SEO TITLE
   * SEO META TAGS
   */

  private updateMetaData() {
    // Title
    this.title.setTitle(`${this.course?.seoTitle}`);
    // Meta
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({
      name: 'description',
      content: `${this.course?.seoDescription}`,
    });
    this.meta.updateTag({
      name: 'keywords',
      content: `${this.course?.seoKeywords}`,
    });
    // Facebook
    this.meta.updateTag({
      name: 'og:title',
      content: `${this.course?.seoTitle}`,
    });
    this.meta.updateTag({ name: 'og:type', content: 'website' });
    this.meta.updateTag({
      name: 'og:url',
      content: 'https://course.softlabit.com/',
    });
    // this.meta.updateTag({ name: 'og:image', content: `${this.seoByPageName?.image}` });
    this.meta.updateTag({
      name: 'og:description',
      content: `${this.course?.seoDescription}`,
    });
    // Twitter
    this.meta.updateTag({
      name: 'twitter:title',
      content: `${this.course?.seoTitle}`,
    });
    this.meta.updateTag({
      name: 'twitter:image',
      content:
        'https://ftp.softlabit.com/uploads/statics/softlab-it-company.png',
    });
    this.meta.updateTag({
      name: 'twitter:description',
      content: `${this.course?.seoDescription}`,
    });

    // Canonical
    this.canonicalService.setCanonicalURL();
  }


  public openComponentDialog(event: any) {
    event.stopPropagation();
    // if(id){
    //   this.router.navigate([],{queryParams:{productId:id},queryParamsHandling:"merge"})
    // }
    const dialogRef= this.dialog.open(ConfirmDialogComponent, {
      panelClass: ['theme-dialog', 'full-screen-modal'],
      autoFocus: false,
      disableClose: false
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        // console.log(dialogResult)
        if (dialogResult ===true){
          // this.addOrder(this.orderData);
        }

      }
    });

  }

  ngOnDestroy() {
    if (this.subGetData1) {
      this.subGetData1.unsubscribe();
    }
    if (this.subGetData2) {
      this.subGetData2.unsubscribe();
    }
    if (this.subGetData3) {
      this.subGetData3.unsubscribe();
    }
    if (this.subGetData4) {
      this.subGetData4.unsubscribe();
    }
    if (this.subAddData1) {
      this.subAddData1.unsubscribe();
    }
    if (this.subRoute1) {
      this.subRoute1.unsubscribe();
    }
    if (this.subRoute2) {
      this.subRoute2.unsubscribe();
    }
  }

  couponShow() {
    this.couponShowHide = !this.couponShowHide;
  }

  protected readonly faAngleDown = faAngleDown;
}
