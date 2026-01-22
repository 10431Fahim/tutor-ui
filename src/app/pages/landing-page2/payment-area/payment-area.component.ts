import {DecimalPipe, DOCUMENT, isPlatformBrowser, NgClass, NgIf, ViewportScroller} from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  inject,
  Input,
  OnChanges,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {PricePipe} from '../../../shared/pipes/price.pipe';
import {UtilsService} from '../../../services/core/utils.service';
import {UiService} from '../../../services/core/ui.service';
import {OrderService} from '../../../services/common/order.service';
import {ReloadService} from '../../../services/core/reload.service';
import {DivisionService} from '../../../services/common/division.service';
import {OtpService} from '../../../services/common/otp.service';
import {Coupon} from '../../../interfaces/common/coupon.interface';
import {Division} from '../../../interfaces/common/division.interface';
import {MatDialog} from "@angular/material/dialog";
import {UserService} from '../../../services/common/user.service';
import {CouponService} from "../../../services/common/coupon.service";
import {
  GalleryImageViewerComponent
} from "../../../shared/components/gallery-image-viewer/gallery-image-viewer.component";
import {ImageGalleryComponent} from "../image-gallery/image-gallery.component";
import {Order} from "../../../interfaces/common/order.interface";
import {UserDataService} from "../../../services/common/user-data.service";
import {environment} from "../../../../environments/environment";
import {PaymentService} from "../../../services/common/payment.service";
import {Price} from "../../../interfaces/common/course.interface";
import {MatButtonModule} from "@angular/material/button";
import {PipesModule} from "../../../shared/pipes/pipes.module";
import {PaymentDialogComponent} from "../../../shared/dialog-view/payment-dialog/payment-dialog.component";


@Component({
  selector: 'app-payment-area',
  templateUrl: './payment-area.component.html',
  styleUrls: ['./payment-area.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgIf, GalleryImageViewerComponent, ImageGalleryComponent, NgClass, MatButtonModule, DecimalPipe, PipesModule],
  providers: [PricePipe],
})
export class PaymentAreaComponent implements OnInit, OnChanges {
  // Inputs
  @Input() singleLandingPage: any;

  // ViewChild Refs
  @ViewChild('payment') mainEl!: ElementRef;
  @ViewChild('nameInput') nameInput!: ElementRef;
  @ViewChild('phoneInput') phoneInput!: ElementRef;
  @ViewChild('addressInput') addressInput!: ElementRef;
  @ViewChild('otpInput') otpInput!: ElementRef;

  dataForm: FormGroup;
  quantity = 1;
  animateGrandTotal = false;
  needRefreshForm: boolean = false;
  deliveryChargeAmount: number = 0;
  selectedPaymentProvider = 'Cash on Delivery';
  note: any;
  public countdown = 60; // seconds
  private countdownInterval: any;
  productFixed = false;
  otpCode: string | null = null;
  shippingAddress: any;
  couponCode: string = null;
  couponDiscount: number = 0;
  deliveryCharge: any;
  userLandingDiscount: any;
  currency = 'BDT';
  isLoaded: boolean = false;
  orderData: any;
  product: any;
  carts: any[] = [];
  private eventId: string;
  image: any;
  prevImage: any;
  isLoadingPhoneNo: boolean = false;
  // Loading
  isLoading: boolean = false;
  isInvalidOtp: boolean = false;
  isValidOtp: boolean = false;
  isSendOtp: boolean = false;
  isCoupon: boolean = false;
  isPageLoading: boolean = false;
  coupon: Coupon = null;
  divisions?: Division[] = [];
  selectedDivision: string | null = null;
  dropdownVisible = false;
  deliveryOptionType: any;
  isEnableOrderNote: boolean;
  isEnableOtp: boolean;
  advancePayment: any[] = [];
  allShopID = ['688712bcdcdd7416499b7808'];
  // Gallery
  isGalleryOpen: boolean = false;
  galleryImages: string[] = [];
  selectedImageIndex: number = 0;
  showModal = false;
  isMobile: number;
  shopId: any;
  user: any;
  selectedPriceData: Price = null;

  // Store Data
  selectedVariationList: any = null;
  selectedVariation: string = null;
  selectedVariation2: string = null;
  private subAddData1!: Subscription;
  private subGetData4!: Subscription;

  // Subscriptions
  private subscriptions: Subscription[] = [];

  // Inject
  private readonly reloadService = inject(ReloadService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly divisionService = inject(DivisionService);
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly otpService = inject(OtpService);
  private readonly userService = inject(UserService);
  private readonly dialog = inject(MatDialog);
  private readonly couponService = inject(CouponService);
  private readonly userDataService = inject(UserDataService);
  private readonly paymentService = inject(PaymentService);
  private readonly pricePipe = inject(PricePipe);
  private readonly utilService = inject(UtilsService);

  constructor(private fb: FormBuilder, private orderService: OrderService, @Inject(DOCUMENT) private document: Document, private utilsService: UtilsService, private uiService: UiService, private router: Router,) {

    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      division: [null, Validators.required],
      phoneNo: [null, [Validators.required, this.mobileValidator]],
      shippingAddress: [null, Validators.required],
      code: [null, this.isSendOtp ? [Validators.required] : []]
    });

  }

  ngOnInit() {
    this.createCartFromLandingPage();
    this.getLoggedUserData();

    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth;
    }

  }


  ngOnChanges() {
    this.createCartFromLandingPage();
    this.product = this.singleLandingPage?.product;

  }

  createCartFromLandingPage() {
    const product = this.singleLandingPage?.product;

    if (!product) return;

    const cartItem = {
      isSelected: true,
      product: product,
      quantity: this.quantity,
      selectedQty: this.quantity,
      variation: this.selectedVariationList
        ? {
          name: this.selectedVariationList.name,
          _id: this.selectedVariationList._id,
          image: this.selectedVariationList?.image,
          sku: this.selectedVariationList.sku
        }
        : null,
    };

    this.carts = [cartItem];

  }

  private addOrder(data: any) {
    this.isLoading = true;

  }


  /**
   * UI Methods
   * onConfirmOrder()
   */
  public onConfirmOrder() {


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
            this.uiService.success('Your course under checking. After checking added to your enroll list');

            // this.bKashCreatePayment(data, res.data?._id);
          } else {
            this.uiService.success('Course added to your enroll list');
            this.router.navigate(['/my-course']);
          }
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
      approveStatus: 'not-approved',
      paymentStatus:
        this.pricePipe.transform(
          this.singleLandingPage?.course,
          'salePrice',
          this.selectedPriceData
        ) > 0
          ? 'unpaid'
          : 'paid',
      orderStatus:
        this.pricePipe.transform(
          this.singleLandingPage?.course,
          'salePrice',
          this.selectedPriceData
        ) > 0
          ? 'Pending'
          : 'Delivered',
      subTotal: this.pricePipe.transform(
        this.singleLandingPage?.course,
        'regularPrice',
        this.selectedPriceData
      ),
      discount: this.pricePipe.transform(
        this.singleLandingPage?.course,
        'discountAmount',
        this.selectedPriceData
      ),

      grandTotal: this.coupon ? this.pricePipe.transform(
        this.singleLandingPage?.course,
        'regularPrice',
        this.selectedPriceData
      ) - this.couponDiscount : this.pricePipe.transform(
        this.singleLandingPage?.course,
        'salePrice',
        this.selectedPriceData
      ),
      paidAmount: 0,
      coupon: this.coupon ? this.coupon._id : null,
      couponDiscount: this.couponDiscount,
      checkoutDate: this.utilService.getDateString(new Date()),
      note: null,
      user: this.userService.getUserId(),
      orderType: this.singleLandingPage?.course?.type,
      liveCourseCode: null,
      orderItem: {
        _id: this.singleLandingPage?.course._id,
        name: this.singleLandingPage?.course?.name,
        slug: this.singleLandingPage?.course?.slug,
        type: this.singleLandingPage?.course?.type,
        image: this.singleLandingPage?.course?.bannerImage
          ? this.singleLandingPage?.course?.bannerImage
          : this.singleLandingPage?.course?.image,
        category: this.singleLandingPage?.course?.category,
        subCategory: this.singleLandingPage?.course?.subCategory,
        childCategory: this.singleLandingPage?.course?.childCategory,
        specifications: this.singleLandingPage?.course?.specifications,
        salePrice: this.pricePipe.transform(
          this.singleLandingPage?.course,
          'salePrice',
          this.selectedPriceData
        ),
        discountType: this.singleLandingPage?.course.isMultiplePrice
          ? this.selectedPriceData?.discountType
          : this.singleLandingPage?.course.discountType,
        discountAmount: this.singleLandingPage?.course.isMultiplePrice
          ? this.selectedPriceData?.discountAmount
          : this.singleLandingPage?.course.discountAmount,
        unit: this.selectedPriceData
          ? {
            name: this.selectedPriceData?.name,
            duration: this.selectedPriceData?.duration,
          }
          : null,
      },
    };

    if (this.userService.getUserStatus()) {
      this.openDialog(mData)
      // this.addOrderByUser(mData);
    } else {
      this.isLoading = false;
      this.router
        .navigate(['/login'], {
          queryParams: {navigateFrom: this.router.url},
        })
        .then();
    }
  }


  openDialog(data: any) {
    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      data: {grantTotal: data?.grandTotal, bkashNumber: '01850989488'},
    });

    dialogRef.afterClosed().subscribe((result) => {

      if (result) {
        console.log('Dialog Data:', result);

        // API call
        const mData = {...data, ...result}
        this.addOrderByUser(mData);
      } else {
        this.isLoading = false;
      }
    });
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


  mobileValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value || '';

    // Remove space and check for 11 or 13 digit BD number
    const trimmed = value.trim();
    const regex = /^(?:\+88)?01[3-9]\d{8}$/;

    if (!regex.test(trimmed)) {
      return {invalidMobile: true};
    }

    return null;
  }


  // User data get by phone number
  onPhoneNumberInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    if (input.length === 11) {
      this.isLoadingPhoneNo = true;
      this.handlePhoneNumberFilled({phoneNo: input});
    }
  }

  handlePhoneNumberFilled(data: any): void {
    // Call your function and stop the spinner after completion

  }


  getDeliveryLabel(): string {
    const selected = this.dataForm?.value.division;
    const city = this.deliveryCharge?.city;
    if (!selected || !city) return '';
    return selected === city ? `Inside ${city} :` : `Outside ${city} :`;
  }

  /**
   * Gallery View
   * openGallery()
   * closeGallery()
   */
  openGallery(event: any, images: string[], index?: number): void {
    event.stopPropagation();

    if (index) {
      this.selectedImageIndex = index;
    }
    this.galleryImages = images;
    this.isGalleryOpen = true;
  }

  openGalleryMobile(event: any, images: string[], index?: number): void {
    event.stopPropagation();

    if (index) {
      this.selectedImageIndex = index;
    }
    this.galleryImages = images;
    this.showModal = true;
  }


  closeGallery(): void {
    this.isGalleryOpen = false;
  }

  closeModal1() {
    this.showModal = false;
  }

  @HostListener('window:scroll')
  scrollBody() {
    if (isPlatformBrowser(this.platformId)) {
      // Get the footer's Y offset position
      const [_, footerTop] = this.viewportScroller.getScrollPosition();
      const windowHeight = window.innerHeight;
      const footerOffsetTop = document.getElementById('payment1')?.offsetTop || 0;

      if (window.scrollY > 200 && window.scrollY + windowHeight >= footerOffsetTop) {
        this.productFixed = true;
      } else {
        this.productFixed = false;
      }
    }
  }

  private scrollToField(field: ElementRef) {
    if (field) {
      field.nativeElement.scrollIntoView({behavior: 'smooth', block: 'center'});
      field.nativeElement.focus();
    }
  }

  triggerGrandTotalAnimation() {
    this.animateGrandTotal = false;
    setTimeout(() => {
      this.animateGrandTotal = true;
      setTimeout(() => this.animateGrandTotal = false, 400);
    });
  }

  onOtpEnter(value: string): void {
    this.otpCode = value;
    // this.validateOtpWithPhoneNo('');
  }

  closePopup() {
    this.isSendOtp = false;
  }


  /**
   * COUPON HANDLE
   * checkCouponAvailability()
   * calculateCouponDiscount()
   * onRemoveCoupon()
   */



  onRemoveCoupon() {
    this.couponDiscount = 0
    this.couponCode = null;
    this.coupon = null;

  }

}
