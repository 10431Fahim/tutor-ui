import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrderStatus} from "../../../enum/order.enum";
import {ORDER_STATUS} from "../../../core/utils/app-data";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Select} from "../../../interfaces/core/select.interface";
import {Order} from "../../../interfaces/common/product-order.interface";
import {ProductOrderService} from "../../../services/common/product-order.service";

@Component({
  selector: 'app-order-track',
  templateUrl: './order-track.component.html',
  styleUrls: ['./order-track.component.scss']
})
export class OrderTrackComponent implements OnInit, OnDestroy {
  //Store Data
  order: Order;
  orderId: number | any;
  public OrderStatusEnum = OrderStatus;

  public orderStatus: Select[] = ORDER_STATUS;
  //Subscription
  private subParamOne: Subscription;
  private subDataOne:Subscription;


  constructor(
    private orderService: ProductOrderService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    //Get Paramp
    this.subParamOne = this.activatedRoute.paramMap.subscribe(res => {
      this.orderId = res.get('orderId');
      if (this.orderId) {
        this.getOrderById(this.orderId);
      }
    })
  }

  /**
   * ORDER CONTROL
   * getOrderById()
   */
  getOrderById(orderId:string | any){
    this.subDataOne = this.orderService.getOrderById(orderId).subscribe(
      (res) => {
        if(res.success){
          this.order = res.data;
          // console.log('this.order',this.order)
        }
      },
      (err) => {
        if(err){
          console.log(err);
        }
      }
    )
  }



  /**
   * ON NG DESTROY
   */

  ngOnDestroy(): void {
    if (this.subParamOne) {
      this.subParamOne.unsubscribe();
    }
    if(this.subDataOne){
      this.subDataOne.unsubscribe();
    }
  }
}
