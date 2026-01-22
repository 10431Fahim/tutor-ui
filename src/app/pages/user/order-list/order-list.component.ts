import {Component, OnDestroy, OnInit} from '@angular/core';
import {Order} from "../../../interfaces/common/product-order.interface";
import {Subscription} from "rxjs";
import {ProductOrderService} from "../../../services/common/product-order.service";
import {ReloadService} from "../../../services/core/reload.service";
import {UiService} from "../../../services/core/ui.service";
import {FilterData} from "../../../interfaces/core/filter-data.interface";

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit, OnDestroy {
  //Store Data
  allOrders: Order[];
  selectedStatus: string = 'Select Any ';
  relatedProducts: Order | any;
  //Subscription
  private subParamData: Subscription;
  private subDataOne: Subscription;
  //Subscriptions
  private subOrderData: Subscription;
  private subCancelData: Subscription;
  private subReload: Subscription;

  constructor(
    private orderService: ProductOrderService,
    private reloadService: ReloadService,
    // private specialPackageService: SpecialPackagesService,
    private uiService: UiService
  ) {

  }

  ngOnInit() {
    this.subReload = this.reloadService.refreshData$.subscribe(() => {
      this.getOrdersByUser();
    })
    /**
     * BASE DATA GET
     */
    this.getOrdersByUser();
  }
  /**
   * HTTP REQUEST HANDLE GET ALL ORDER BY USER
   *  getOrdersByUser();
   * cancelOrderById()
   * filterOrderList()
   */

  getOrdersByUser(data?: { orderStatus: number }) {
    const mSelect = {
      orderId: 1,
      paymentType: 1,
      grandTotal: 1,
      orderStatus: 1,
      orderedItems: 1,
      paymentStatus: 1,
    }
    const filterData: FilterData = {
      select: mSelect,
      pagination: null,
      sort: { createdAt: -1 },
      filter: data !== null ? data : null
    }

    this.subOrderData = this.orderService.getOrdersByUser(filterData).subscribe(
      (res) => {
        if (res.success) {
          this.allOrders = res.data;
          // console.log("this.allOrders33",this.allOrders);
          //
          // const uniqueIds = [...new Set(this.allOrders.orderedItems.map(obj => obj.category._id))];
          // console.log('uniqueIds', uniqueIds)
          // this.getRelatedProductsByMultiCategoryId(uniqueIds)
        }
      },
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    )
  }

  // getRelatedProductsByMultiCategoryId(ids:any) {
  //   this.subDataOne = this.specialPackageService.getRelatedProductsByMultiCategoryId( {ids , limit: 5}).subscribe(
  //     (res) => {
  //       if (res.success) {
  //         this.relatedProducts = res.data;
  //         console.log('this.relatedSpecialPackageProducts',this.relatedProducts);
  //
  //       }
  //     },
  //     (err) => {
  //       if (err) {
  //         console.log(err);
  //       }
  //     }
  //   )
  // }




  cancelOrderById(id: string, data: any) {
    this.subCancelData = this.orderService.updateOrderById(id, data).subscribe(
      (res) => {
        if (res.success) {
          this.uiService.success('Order Successfully Cancelled');
          this.reloadService.needRefreshData$();
        }
      },
      (err) => {
        console.log(err);
      }
    )
  }

  filterOrderList(selectedStatus: string, data: { orderStatus: number }) {
    if (selectedStatus) {
      this.selectedStatus = selectedStatus;
      this.getOrdersByUser(data);
    }
  }

  /**
   * ON DESTROY SUBSCRIPTION
   */
  ngOnDestroy(): void {
    if (this.subCancelData) {
      this.subCancelData.unsubscribe();
    }

    if (this.subOrderData) {
      this.subOrderData.unsubscribe();
    }
    if (this.subReload) {
      this.subReload.unsubscribe();
    }
  }

}
