import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-payment-fail',
  templateUrl: './payment-fail.component.html',
  styleUrls: ['./payment-fail.component.scss'],
})
export class PaymentFailComponent implements OnInit {
  // Font Awesome Icon
  faExclamation = faExclamation;

  // Store Data
  message: string = null;

  // Inject
  private readonly activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    // GET DATA FORM PARAM
    this.activatedRoute.queryParamMap.subscribe((qParam) => {
      this.message = qParam.get('message');
    });
  }
}
