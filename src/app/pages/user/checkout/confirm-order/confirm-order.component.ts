import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
  styleUrls: ['./confirm-order.component.scss'],
})
export class ConfirmOrderComponent implements OnInit {

  isOrdered: boolean = false;
  orderId: number;

  constructor() { }

  ngOnInit() { }

  /**
   * CONFIRM POPUP CONTROLL
   * onShowPop()
   * onHidePop()
   */

  onShowPop(orderId) {
    this.isOrdered = true;
    this.orderId = orderId;
  }

  onHidePop() {
    this.isOrdered = false;
  }


}
