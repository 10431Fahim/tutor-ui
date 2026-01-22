import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {OrderStatus} from "../../../enum/order.enum";
import {Select} from "../../../interfaces/core/select.interface";
import {ORDER_STATUS} from "../../../core/utils/app-data";
import {Order} from "../../../interfaces/common/product-order.interface";
import {ProductOrderService} from "../../../services/common/product-order.service";
import {ReloadService} from "../../../services/core/reload.service";
import {MatDialog} from "@angular/material/dialog";
import {RatingAndReviewComponent} from "./rating-and-review/rating-and-review.component";


@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit, OnDestroy {
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
    private activatedRoute: ActivatedRoute,
    private reloadService: ReloadService,
    private dialog: MatDialog
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
   * Dialog Component
   * openAddressDialog()
   */
  openReviewDialog(data:any) {
    event.preventDefault();
    event.stopPropagation();
    this.reloadService.needRefreshData$();
    const dialogRef = this.dialog.open(RatingAndReviewComponent, {
      panelClass: ['theme-dialog'],
      width: '100%',
      maxWidth: '850px',
      maxHeight: '100%',
      autoFocus: false,
      disableClose: false,
      data: data,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {

        dialogRef.close(dialogResult)
      }
    });
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
