import { Component, OnInit, inject } from '@angular/core';
import { OrderService } from '../../services/common/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../../interfaces/common/order.interface';
import { UserService } from '../../services/common/user.service';
import { environment } from '../../../environments/environment';
import { PaymentService } from '../../services/common/payment.service';
import { DOCUMENT } from '@angular/common';
import { UiService } from '../../services/core/ui.service';

@Component({
  selector: 'app-partial-payment',
  templateUrl: './partial-payment.component.html',
  styleUrls: ['./partial-payment.component.scss']
})
export class PartialPaymentComponent implements OnInit {

  // Store Data
  private id: string;
  order: Order = null;
  hasPreview: boolean = true;

  // Loader
  isLoading: boolean = false;

  // Inject
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly orderService = inject(OrderService);
  private readonly paymentService = inject(PaymentService);
  private readonly uiService = inject(UiService);
  private readonly document = inject(DOCUMENT);


  ngOnInit() {
    // GET ID FROM PARAM
    this.activatedRoute.paramMap.subscribe(param => {
      this.id = param.get('id');
      if (this.id) {
        this.getOrderById();
      }
    })
  }


  /**
   * HTTP Req Handle
   * getOrderById()
   * updateOrderByUserId()
   * updateFreeCourseByUser()
   */
  private getOrderById() {
    this.orderService.getOrderById(this.id).subscribe({
      next: res => {
        const order = res.data;
        if (order?.user === this.userService.getUserId()) {
          this.hasPreview = true;
          this.order = order;
        } else {
          this.hasPreview = false;
        }
      },
      error: err => {
        console.log(err)
      }
    })
  }

  private updateFreeCourseByUser(
    _id: string,
    data: any,
  ) {
    this.orderService
      .updateFreeCourseByUser(_id, data)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success) {
            this.uiService.success('Success! Please check your enroll list.')
            this.router.navigate(['/account']).then();
          } else {
            this.uiService.warn(res.message)
          }
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
  }

  private updateOrderByUserId(_id: string, data: any, paymentRedirectUrl: string) {
    this.orderService.updateOrderByUserId(_id, data).subscribe({
      next: (res) => {
        if (res.success) {
          this.document.location.href = paymentRedirectUrl;
        } else {
          this.isLoading = false;
        }
      },
      error: err => {
        console.log(err);
        this.isLoading = false;
      }
    },
    )
  }


  /**
   * onBuyCourse()
   * bkashCreatePayment()
   */
  public onBuyCourse() {
    this.isLoading = true;

    if (this.userService.getUserStatus()) {
      if (this.order.isPartialPaymentOrder) {
        this.bKashCreatePayment();
      } else {
        this.updateFreeCourseByUser(this.id, {});
      }

    } else {
      this.isLoading = false;
      this.router.navigate(['/login'], { queryParams: { navigateFrom: this.router.url } }).then();
    }
  }

  private bKashCreatePayment() {
    this.isLoading = true;

    const reqData = {
      mode: '0011',
      payerReference: ' ',
      callbackURL: environment.bkashCallbackUrl,
      amount: this.order?.isPartialPaymentOrder ? this.order.partialAmount : this.order.grandTotal,
      currency: 'BDT',
      intent: 'sale',
      merchantInvoiceNumber: this.order?._id
    };

    this.paymentService.createBkashPayment(reqData).subscribe({
      next: res => {
        if (res.success) {
          const updateData = {
            paymentMethod: 'bKash',
            paymentApiType: 'bKash',
            paymentRefId: res.data.paymentID
          }
          this.updateOrderByUserId(this.order?._id, updateData, res.data.bkashURL)
        } else {
          this.isLoading = false;
          this.uiService.warn('Something went wrong! Please try again.')
        }
      },
      error: err => {
        console.log(err);
        this.isLoading = false;
      }
    })
  }

}
