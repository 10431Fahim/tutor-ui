import { Component, HostListener, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../../services/core/storage.service';
import { PaymentService } from '../../../services/common/payment.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-payment-bkash',
  templateUrl: './payment-bkash.component.html',
  styleUrls: ['./payment-bkash.component.scss'],
})
export class PaymentBkashComponent implements OnInit, OnInit {
  // Font Awesome Icon
  faSpinner = faSpinner;

  // Store Data
  paymentID: string;
  status: string;

  // Inject
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly paymentService = inject(PaymentService);
  private readonly storageService = inject(StorageService);
  private readonly router = inject(Router);

  // HostListener
  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event: any) {
    return false;
  }

  ngOnInit(): void {
    // GET DATA FORM PARAM
    this.activatedRoute.queryParamMap.subscribe((qParam) => {
      this.paymentID = qParam.get('paymentID');
      this.status = qParam.get('status');
      if (this.status && this.paymentID) {
        this.callbackBkashPayment();
      } else {

        this.router.navigate(['/payment/fail'], {
          queryParams: { message: 'Payment canceled.' },
        });
      } this.storageService.removeLocalData('PAYMENT_COURSE_ID');
      this.storageService.removeLocalData('PAYMENT_ID');
    });
  }

  /**
   * HTTP REQUEST HANDLE
   * callbackBkashPayment()
   */
  private callbackBkashPayment() {
    const courseId = localStorage.getItem('PAYMENT_COURSE_ID');
    const data = {
      paymentID: this.paymentID,
      status: this.status,
      courseId: courseId,
    };

    this.paymentService.callbackBkashPayment(data).subscribe({
      next: (res) => {
        if (res.data.statusCode === '0000') {
          this.storageService.removeLocalData('PAYMENT_COURSE_ID');
          this.storageService.removeLocalData('PAYMENT_ID');
          this.router.navigate(['/payment/success'], {
            queryParams: { message: res.data.message },
          });
        } else {
          this.router.navigate(['/payment/fail'], {
            queryParams: { message: res.data.message },
          });
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
