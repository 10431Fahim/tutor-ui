import { Component, OnInit } from '@angular/core';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-payment-cancel',
  templateUrl: './payment-cancel.component.html',
  styleUrls: ['./payment-cancel.component.scss'],
})
export class PaymentCancelComponent implements OnInit {
  // Font Awesome Icon
  faExclamation = faExclamation;

  ngOnInit(): void {}
}
