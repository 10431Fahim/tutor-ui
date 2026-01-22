import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {ConfirmOrderComponent} from './confirm-order/confirm-order.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UiService} from 'src/app/services/core/ui.service';
import {CartService} from 'src/app/services/common/cart.service';
import {Subscription} from 'rxjs';
import {Cart} from 'src/app/interfaces/common/cart.interface';
import {EngBnNumPipe} from 'src/app/shared/pipes/eng-bn-num.pipe';
import {Product} from 'src/app/interfaces/common/product';
import {ReloadService} from 'src/app/services/core/reload.service';

import {UserService} from 'src/app/services/common/user.service';
import {UserDataService} from 'src/app/services/common/user-data.service';

import {PaymentService} from 'src/app/services/common/payment.service';

import {DOCUMENT} from '@angular/common';

import {Router} from '@angular/router';
import {DiscountTypeEnum} from "../../../enum/discount.enum";
import {UtilsService} from "../../../services/core/utils.service";
import {FilterData} from "../../../interfaces/core/filter-data.interface";
import {User} from "../../../interfaces/common/user.interface";
import {DivisionService} from "../../../services/common/division.service";
import {ZoneService} from "../../../services/common/zone.service";
import {Area} from "../../../interfaces/common/area.interface";
import {Division} from "../../../interfaces/common/division.interface";
import {AreaService} from "../../../services/common/area.service";
import {CouponService} from "../../../services/common/coupon.service";
import {ShippingChargeService} from "../../../services/common/shipping-charge.service";
import {ShippingCharge} from "../../../interfaces/common/shipping-charge.interface";
import {Zone} from "../../../interfaces/common/zone.interface";
import {Coupon} from "../../../interfaces/common/coupon.interface";
import {PAYMENTMETHOD} from "../../../core/utils/app-data";
import {OrderStatus} from "../../../enum/order.enum";
import {environment} from "../../../../environments/environment";
import {SslInitResponse} from "../../../interfaces/common/ssl-init-response.interface";
import {SslInit} from "../../../interfaces/common/ssl-init";
import {ProductOrderService} from "../../../services/common/product-order.service";
import {PricesPipe} from "../../../shared/pipes/prices.pipe";
import {Order} from "../../../interfaces/common/product-order.interface";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  providers: [PricesPipe, EngBnNumPipe]
})
export class CheckoutComponent implements OnInit, OnDestroy {
  @ViewChild('confirm') confirm: ConfirmOrderComponent;
  country = 'bangladesh'

   selectDivisionData: any;
   selectAreaData: any;
   selectZoneData: any;

  deliveryOption: any;
  //Store Data
  paymentMethod = PAYMENTMETHOD;
  user: User;
  selectedPaymentMethod: string = 'cash_on_delivery';
  couponCode: string = '';
  coupon: Coupon = null;
  couponDiscount: number = 0;
  currency = 'BDT';
  orderBtnTxt = 'Complete Order'
  disableCompleteOrder: boolean = false;
  shippingCharge: ShippingCharge;
  divisions: Division[] = [];
  area: Area[] = [];
  zone: Zone[] = [];
  isLoading: boolean = false;

  //Form Group
  formData!: FormGroup;

  // Cart Data
  carts: Cart[] = [];

  //Subscriptions
  private subCartReload: Subscription;
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour: Subscription;
  private subDataFive: Subscription;
  private subDataSix: Subscription;
  private subDivisionData: Subscription;
  private subAreaData: Subscription;
  private subZoneData: Subscription;
  private subDataNine: Subscription;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    public userService: UserService,
    public userDataService: UserDataService,
    private cartService: CartService,
    private reloadService: ReloadService,
    private uiService: UiService,
    private shippingChargeService: ShippingChargeService,
    private pricePipe: PricesPipe,
    private utilsService: UtilsService,
    private orderService: ProductOrderService,
    private couponService: CouponService,
    private paymentService: PaymentService,
    private divisionService: DivisionService,
    private areaService: AreaService,
    private zoneService: ZoneService,
    @Inject(DOCUMENT) private document: Document,

  ) { }

  ngOnInit() {
    //Base Data
    this.initForm()
    this.patchData();
    // CART FUNCTION
    this.subCartReload = this.reloadService.refreshCart$.subscribe(() => {
      if (this.userService.getUserStatus()) {
        this.getCartsItems();
      }
    });


    // Base Data
    if (this.userService.getUserStatus()) {
      this.getLoggedInUserData();
      this.getCartsItems();
    }

    this.getShippingCharge();
    this.getAllDivision();
  }

  /**
   * FORM CONTROLL METHODS
   * initForm()
   * onSubmit()
   * onShow()
   */
  initForm() {
    this.formData = this.fb.group({
      areaType: ['inside', Validators.required], // NEW: Area type selection (inside/outside Dhaka City)
      name: ['', Validators.required],
      phoneNo: ['', Validators.required],
      alternativePhoneNo: [''],
      country: ['bangladesh', Validators.required],
      division: [null], // No initial validators - will be set dynamically
      area: [null], // No initial validators - will be set dynamically
      zone: [''],
      note: [''],
      addressType: ['home', Validators.required],
      address: [''],
      paymentMethod: ['cash_on_delivery', Validators.required],
      deliveryOptions: ['1', Validators.required],
      isCheckedTerms: [false, Validators.required]
    });
  }

  // NEW: Handler for areaType dropdown change
  onAreaTypeChange(event: any) {
    const value = event.value;
    if (value === 'inside') {
      this.formData.patchValue({
        division: null,
        area: null,
        zone: '',
        deliveryOptions: '1'
      });
      // For inside Dhaka: disable fields and clear validators
      this.formData.get('division')?.disable();
      this.formData.get('area')?.disable();
      this.formData.get('zone')?.disable();
      this.formData.get('division')?.clearValidators();
      this.formData.get('area')?.clearValidators();
      this.formData.get('zone')?.clearValidators();
      this.formData.get('division')?.updateValueAndValidity();
      this.formData.get('area')?.updateValueAndValidity();
      this.formData.get('zone')?.updateValueAndValidity();
    } else {
      this.formData.patchValue({
        deliveryOptions: '2'
      });
      // For outside Dhaka: enable fields and set required validators
      this.formData.get('division')?.enable();
      this.formData.get('area')?.enable();
      this.formData.get('zone')?.enable();
      this.formData.get('division')?.setValidators([Validators.required]);
      this.formData.get('area')?.setValidators([Validators.required]);
      this.formData.get('zone')?.setValidators([Validators.required]);
      this.formData.get('division')?.updateValueAndValidity();
      this.formData.get('area')?.updateValueAndValidity();
      this.formData.get('zone')?.updateValueAndValidity();
    }
  }

  patchData() {
    // if (this.data) {
    //   this.formData.patchValue(this.data);
    //   this.formData.patchValue({ division: this.data?.division?._id });
    //   this.formData.patchValue({ area: this.data?.area?._id });
    //   this.formData.patchValue({ zone: this.data?.zone?._id });
      this.getAllArea(this.formData.get('division')?.value);
      // this.getAllZone(this.formData.get('area')?.value);
      // this.isEdit = true;
      // this.selectEdittedAdress = this.data;
    // } else {
    //   // this.isEdit = false;
    // }
  }

  /**
   * HTTP REQ HANDLE
   * getLoggedInUserData()
   * getCartsItems()
   * getCarsItemFromLocal()
   * getShippingCharge()
   * addOrder()
   * checkCouponAvailability()
   */
  private getLoggedInUserData() {
    const select = 'name addresses email phoneNo username';
    this.subDataOne = this.userDataService.getLoggedInUserData(select)
      .subscribe(res => {
        this.user = res.data;
        // Use patchValue to update form controls so Angular Material labels float correctly
        this.formData.patchValue({ 'phoneNo': this.user.username })
        if (this.user?.name) {
          this.formData.patchValue({ 'name': this.user.name })
        }
      }, error => {
        console.log(error);
      });
  }


  private getCartsItems() {
    this.subDataTwo = this.cartService.getCartByUser()
      .subscribe(res => {
        this.carts = res.data;
      }, error => {
        console.log(error);
      });
  }



  private getShippingCharge() {
    this.subDataFive = this.shippingChargeService.getShippingCharge()
      .subscribe(res => {
        this.shippingCharge = res.data;
      }, err => {
        console.log(err);
      });
  }



  /***
   * HTTP REQUEST HANDLE
   * getAllDivision()
   * getAllArea()
   * getAllZone()
   * addAddress()
   * getUserAddress()
   *
   */

  private getAllDivision() {
    let mSelect = {
      name: 1,
    }
    const filter: FilterData = {
      filter: { status: 'publish' },
      select: mSelect,
      pagination: null,
      sort: { name: 1 }
    }

    this.subDivisionData = this.divisionService.getAllDivisions(filter).subscribe(
      (res) => {
        if (res.success) {
          this.divisions = res.data;
        }
      },
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    )
  }

  private getAllArea(id: string) {
    const select = 'name';
    this.subAreaData = this.areaService.getAreaByParentId(id, select).subscribe(
      (res) => {
        if (res.success) {
          this.area = res.data;
        }
      },
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    )
  }


  // private getAllZone(id: string) {
  //   const select = 'name';
  //   this.subZoneData = this.zoneService.getZoneByParentId(id, select).subscribe(
  //     (res) => {
  //       if (res.success) {
  //         this.zone = res.data;
  //       }
  //     },
  //     (err) => {
  //       if (err) {
  //         console.log(err);
  //       }
  //     }
  //   )
  // }


  private addOrder(data: any) {
    this.isLoading = true;
    this.disableCompleteOrder = false;
    this.subDataFour = this.orderService.addOrder(data).subscribe({
      next: (res => {
        switch (this.selectedPaymentMethod) {
          case 'online_payment': {
            // this.sslInitWithOrder(res.data.orderId, res.data._id);
            this.bkashCreatePayment(data, res.data._id)
            break;
          }
          case 'cash_on_delivery': {
            this.isLoading = false;
            this.disableCompleteOrder = true;
            if (res.success) {
              this.uiService.success(res.message);
              this.reloadService.needRefreshCart$(false);
              this.onShow(res.data.orderId);
            } else {
              this.uiService.warn(res.message);
            }
            break;
          }
        }

      }),
      error: (error => {
        this.disableCompleteOrder = true;
        this.isLoading = false;
        console.log(error);
      })
    })
  }


  // public checkCouponAvailability() {
  //   if (!this.couponCode.trim()) {
  //     this.uiService.warn('Please enter your coupon code.')
  //     return;
  //   }
  //
  //   this.subDataSix = this.couponService.checkCouponAvailability(
  //     { couponCode: this.couponCode, subTotal: this.cartSubTotal })
  //     .subscribe(res => {
  //       if (res.success) {
  //         this.uiService.success(res.message);
  //         this.coupon = res.data;
  //         if (this.coupon) {
  //           this.calculateCouponDiscount();
  //         }
  //       } else {
  //         this.uiService.warn(res.message);
  //       }
  //     }, error => {
  //       console.log(error);
  //     });
  // }


  /**
 * ROUTING
 */


  public onConfirmOrder() {
    if (!this.formData.value.isCheckedTerms) {
      this.uiService.warn('Please accept ours terms & condition to continue.')
      return;
    }
    if (this.formData.invalid) {
      this.uiService.warn('Please complete all the required field');
      this.formData.markAllAsTouched();
      return;
    }

    if (!this.formData.value.phoneNo) {
      this.uiService.warn('Please enter phone')
      return;
    }

    let selectDivision = this.divisions.find((d) => d._id === this.formData.value.division);
    let selectArea = this.area.find((d) => d._id === this.formData.value.area);
    // let selectZone = this.zone.find((d) => d._id === this.formData.value.zone);

    this.selectDivisionData = selectDivision;
    this.selectAreaData = selectArea;
    // this.selectZoneData = selectZone;


    // Product Info
    const products = this.carts.map(m => {
      return {
        _id: (m.product as Product)._id,
        name: (m.product as Product).name,
        slug: (m.product as Product).slug,
        image: (m.product as Product).images && (m.product as Product).images.length ? (m.product as Product).images[0] : null,
        category: {
          _id: (m.product as Product).category?._id,
          name: (m.product as Product).category?.name,
          slug: (m.product as Product).category?.slug,
        },
        // author: {
        //   _id: (m.product as Product).author?._id,
        //   name: (m.product as Product).author?.name,
        //   slug: (m.product as Product).author?.slug,
        // },
        // subCategory: {
        //   _id: (m.product as Product).subCategory?._id,
        //   name: (m.product as Product).subCategory?.name,
        //   slug: (m.product as Product).category?.slug,
        // },
        // brand: {
        //   _id: (m.product as Product).brand?._id,
        //   name: (m.product as Product).brand?.name,
        //   slug: (m.product as Product).category?.slug,
        // },
        discountType:  (m.product as Product).discountType,
        discountAmount:  (m.product as Product).discountAmount,
        regularPrice: this.pricePipe.transform((m.product as Product), 'regularPrice'),
        unitPrice: this.pricePipe.transform((m.product as Product), 'salePrice'),
        quantity: m.selectedQty,
        orderType: 'regular',

      } as any;
    });

    const orderData: any = {
      name: this.formData.value.name,
      phoneNo: this.formData.value.phoneNo,
      shippingAddress: this.formData.value.address,
      division: selectDivision,
      area: selectArea,
      // zone: selectZone,
      zone: this.formData.value.zone,
      city: this.formData.value?.city,
      note: this.formData.value?.note,
      paymentType: this.formData.value.paymentMethod,
      paymentStatus: 'unpaid',
      orderStatus: OrderStatus.PENDING,
      orderedItems: products,
      subTotal: this.cartSubTotal,
      deliveryCharge: (this.formData.value.deliveryOptions === '1' ? this.shippingCharge?.deliveryInDhaka : this.shippingCharge?.deliveryOutsideDhaka) || 0,
      discount: this.cartDiscountAmount.toFixed(2),
      totalSave: this.cartDiscountAmount,
      grandTotal: this.grandTotal,
      discountTypes:[{productDiscount: this.cartDiscountAmount.toFixed(2)}],
      checkoutDate: this.utilsService.getDateString(new Date()),
      user: this.user?._id || null,
      coupon: this.coupon ? this.coupon._id : null,
      couponDiscount: this.couponDiscount,
      hasOrderTimeline: true,
      orderTimeline: {
        pending: {
          success: true,
          date:
            new Date(),

          expectedDate: new Date(),
        },
        confirmed: {
          success:
            this.formData?.value?.orderStatus === OrderStatus?.CONFIRM,
          date:
            this.formData?.value?.orderStatus === OrderStatus?.CONFIRM
              ? new Date()
              : null,
          expectedDate: null,
        },
        processed: {
          success:
            this.formData?.value?.orderStatus === OrderStatus?.PROCESSING,
          date:
            this.formData?.value?.orderStatus === OrderStatus?.PROCESSING
              ? new Date()
              : null,
          expectedDate: this.formData?.value?.processingDate,
        },
        shipped: {
          success:
            this.formData?.value?.orderStatus === OrderStatus?.SHIPPING,
          date:
            this.formData?.value?.orderStatus === OrderStatus?.SHIPPING
              ? new Date()
              : null,
          expectedDate: this.formData?.value?.shippingDate,
        },
        delivered: {
          success:
            this.formData?.value?.orderStatus === OrderStatus?.DELIVERED,
          date:
            this.formData?.value?.orderStatus === OrderStatus?.DELIVERED
              ? new Date()
              : null,
          expectedDate: this.formData?.value?.deliveringDate,
        },
        canceled: {
          success: this.formData?.value?.orderStatus === OrderStatus?.CANCEL,
          date:
            this.formData?.value?.orderStatus === OrderStatus?.CANCEL
              ? new Date()
              : null,
          expectedDate: null,
        },
        refunded: {
          success: this.formData?.value?.orderStatus === OrderStatus?.REFUND,
          date:
            this.formData?.value?.orderStatus === OrderStatus?.REFUND
              ? new Date()
              : null,
          expectedDate: null,
        },
      },
    }

    if (products && products.length > 0) {
      this.addOrder(orderData);
    } else {
      this.uiService.warn('Please product add to cart then order ');
      this.router.navigate(['/', 'product-list']);
    }
  }


  private bkashCreatePayment(orderData: Order, _id: string) {


    const reqData = {
      mode: '0011',
      payerReference: ' ',
      callbackURL: environment.bkashProductCallbackUrl,
      amount: orderData.grandTotal,
      currency: 'BDT',
      intent: 'sale',
      merchantInvoiceNumber: _id, // Must be unique
    };
    this.subDataNine = this.paymentService.createBkashPayment(reqData)
      .subscribe({
        next: res => {
          if (res.success) {

            const updateData = {
              paymentMethod: 'bKash',
              paymentApiType: 'bKash',
              paymentRefId: res.data.paymentID,
            };
            this.updateOrderPaymentIdById(_id, updateData, res.data.bkashURL)
          } else {
            this.isLoading = false;
            this.uiService.warn('Something went wrong! Please try again.')
          }
        },
        error: error => {
          this.isLoading = false;
          console.log(error);
        }
      })
  }

  private updateOrderPaymentIdById(
    _id: string,
    data: any,
    bkashURL: string
  ) {
    this.subDataNine = this.orderService
      .updateOrderById(_id, data)
      .subscribe({
        next: res => {
          this.isLoading = false;
          if (res.success) {
            this.document.location.href = bkashURL;
          } else {
            this.uiService.warn(res.message);
          }
        },
        error: err => {
          this.isLoading = false;
          console.log(err);
        }
      })
  }


  /**
 * PAYMENT API
 * sslInitWithOrder()
 * updateOrderSessionKey
 */
  private sslInitWithOrder(orderId: string, _id: string) {
    const baseHost = this.utilsService.getHostBaseUrl();
    const sslPaymentInit: SslInit = {
      store_id: null,
      store_passwd: null,
      total_amount: this.grandTotal,
      currency: this.currency,
      tran_id: orderId,
      success_url: baseHost + '/callback/payment/success',
      fail_url: baseHost + '/callback/payment/fail',
      cancel_url: baseHost + '/callback/payment/cancel',
      ipn_url: environment.sslIpnUrl,
      shipping_method: 'Courier',
      product_name: 'default product',
      product_category: 'default category',
      product_profile: 'general',
      cus_name: this.formData?.value?.name ? this.formData?.value?.name : 'Unknown',
      cus_email: this.user?.email ? this.user?.email : 'guardianpubs@gmail.com',
      cus_add1: this.formData?.value?.address ?? 'Dhaka',
      cus_add2: '',
      cus_city: this.selectDivisionData?.name ?? 'Dhaka',
      cus_state: '',
      cus_postcode: this.selectAreaData?.name ?? 'Dhaka',
      cus_country: 'Bangladesh',
      cus_phone: this.formData.value?.phoneNo ?? '01700000000',
      cus_fax: '',
      ship_name: this.formData?.value?.name ? this.formData?.value?.name : 'Unknown',
      ship_add1: this.formData?.value?.address ?? 'Dhaka',
      ship_add2: '',
      ship_city: this.selectDivisionData?.name ?? 'Dhaka',
      ship_state: '',
      ship_postcode: this.selectAreaData?.name ?? 'Dhaka',
      ship_country: 'Bangladesh',
    };

    // console.log('sslPaymentInit',sslPaymentInit);

    this.paymentService.initSslPayment(sslPaymentInit)
      .subscribe({
        next: res => {
          console.log('res', res)
          if (res.success) {
            const sslInitResponse: SslInitResponse = res.data;
            const sslSessionId = sslInitResponse.sessionkey;
            this.updateOrderSessionKey(_id, { sslSessionId: sslSessionId }, sslInitResponse.GatewayPageURL)
          } else {
            this.orderBtnTxt = 'Complete Order';
            this.uiService.warn('Something went wrong! Please try again.')
          }

        }, error: error => {
          console.log(error);
        }
      });
  }


  private updateOrderSessionKey(_id: string, data: object, url: string) {
    this.subDataSix = this.orderService.updateOrderSessionKey(_id, data)
      .subscribe({
        next: res => {
          console.log('updateOrderSessionKey', res)
          console.log('url', url)
          this.orderBtnTxt = 'Complete Order';
          if (res.success) {
            this.document.location.href = url;
          } else {
            this.uiService.warn(res.message);
          }
        },
        error: err => {
          console.log(err)
        }
      });
  }


  /**
 * CLICK EVENT LOGICAL
 * onSelectPaymentMethod()
 */
  onSelectPaymentMethod(type: string) {
    this.selectedPaymentMethod = type;
  }




  onRemoveCoupon() {
    this.couponDiscount = 0;
    this.couponCode = null;
    this.coupon = null;
  }



  /**
   * Calculation
   * cartSubTotal()
   * grandTotal()
   * cartDiscountAmount()
   * calculateCouponDiscount()
   */

  get cartSubTotal(): number {
    return this.carts.map(t => {
      return this.pricePipe.transform(t.product as Product, 'regularPrice', t.selectedQty) as number;
    }).reduce((acc, value) => acc + value, 0);
  }

  get grandTotal(): number {
    // Delivery charge is set based on areaType and locked, so we just use the selected deliveryOptions
    return (this.cartSubTotal + (this.formData.value.deliveryOptions === '1' ? this.shippingCharge?.deliveryInDhaka : this.shippingCharge?.deliveryOutsideDhaka) || 0) - this.couponDiscount -this.cartDiscountAmount;
  }

  get cartDiscountAmount(): number {
    return this.carts.map(t => {
      return this.pricePipe.transform(t.product as Product, 'discountAmount', t.selectedQty) as number;
    }).reduce((acc, value) => acc + value, 0);
  }

  private calculateCouponDiscount() {
    if (this.coupon.discountType === DiscountTypeEnum.PERCENTAGE) {
      this.couponDiscount = Math.floor((this.coupon.discountAmount / 100) * this.cartSubTotal)
    } else {
      this.couponDiscount = Math.floor(this.coupon.discountAmount)
    }
  }


  /***
   * ON SELECT CHANGE
   * onChangeRegion()
   * onChangeArea()
   */
  onChangeRegion(event: any) {
    if (event) {
      this.getAllArea(this.formData.get('division')?.value);
    }
    let selectDivision = this.divisions.find((d) => d._id === this.formData.value.division);
    this.formData.value.deliveryOptions === '1' ? this.shippingCharge?.deliveryInDhaka : this.formData.value.deliveryOptions === '2' ? this.shippingCharge?.deliveryOutsideDhaka : 0
    // if(selectDivision?.name === 'Dhaka'){
    //   // this.deliveryOption = 1
    //   this.formData.patchValue({deliveryOptions: '1'})
    //   // this.formData.value.deliveryOptions === '1' ? this.shippingCharge?.deliveryInDhaka : this.formData.value.deliveryOptions === '2' ? this.shippingCharge?.deliveryOutsideDhaka : 0
    // }else {
    //   this.formData.patchValue({deliveryOptions: '2'})
    // }
  }

  onChangeArea(event: any) {
    if (event) {
      // console.log(this.dataForm.get('area')?.value);
      // this.getAllZone(this.formData.get('area')?.value);
    }
  }




  /**
   * CONFIRMATION POPUP
   */
  onShow(orderId) {
    if (orderId) {
      this.confirm.onShowPop(orderId);
    }
  }

  /**
   * NG ON DESTROY
   */
  ngOnDestroy() {
    if (this.subCartReload) {
      this.subCartReload.unsubscribe();
    }
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
    if (this.subDataTwo) {
      this.subDataTwo.unsubscribe();
    }
    if (this.subDataThree) {
      this.subDataThree.unsubscribe();
    }
    if (this.subDataFour) {
      this.subDataFour.unsubscribe();
    }
    if (this.subDataFive) {
      this.subDataFive.unsubscribe();
    }
    if (this.subDataSix) {
      this.subDataSix.unsubscribe();
    }
  }



}
