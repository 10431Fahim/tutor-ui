import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs/internal/Subscription";
import {PaymentService} from "../../../services/common/payment.service";
import {StorageService} from "../../../services/core/storage.service";
import {faSpinner} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-product-payment-bkash',
  templateUrl: './product-payment-bkash.component.html',
  styleUrls: ['./product-payment-bkash.component.scss']
})
export class ProductPaymentBkashComponent implements OnInit, OnInit {
  faSpinner = faSpinner;
  paymentID: string;
  status: string;

  // Subscriptions
  private subDataOne: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private paymentService: PaymentService,
    private storageService: StorageService,
    private router: Router,
  ) {

  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event:any) {
    return false;
    //I have used return false but you can your other functions or any query or condition
  }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe(qParam => {
      this.paymentID = qParam.get('paymentID');
      this.status = qParam.get('status');
      if (this.status && this.paymentID) {
        this.callbackBkashPayment();
      } else {

        this.router.navigate(['/payment/fail'], {queryParams: {message: 'Payment canceled.'}});
      }
    });
  }


  private callbackBkashPayment() {
    const data = {
      paymentID: this.paymentID,
      status: this.status,
    };

    this.paymentService.callbackBkashProductPayment(data)
      .subscribe({
        next: res => {
          if (res.data.statusCode === '0000') {
            this.router.navigate(['/payment/payment-success'], {queryParams: {message: res.data.message}});
          } else {
            this.router.navigate(['/payment/fail'], {queryParams: {message: res.data.message}});
          }
        },
        error: error => {
          console.log(error);
        }
      })

  }

  /**
   * NG ON DESTROY
   */
  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
  }
}
