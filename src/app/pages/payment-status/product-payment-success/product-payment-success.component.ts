import { Component } from '@angular/core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-product-payment-success',
  templateUrl: './product-payment-success.component.html',
  styleUrls: ['./product-payment-success.component.scss']
})
export class ProductPaymentSuccessComponent {
// Font Awesome Icon
  faCheck = faCheck;

  constructor() {}

  ngOnInit(): void {}
}
