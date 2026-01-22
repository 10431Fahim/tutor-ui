import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/interfaces/common/user.interface';
import { UserDataService } from 'src/app/services/common/user-data.service';
import { UserService } from 'src/app/services/common/user.service';
import { ReloadService } from 'src/app/services/core/reload.service';
import { ShopInformation } from 'src/app/interfaces/common/shop-information.interface';
import { ShopInformationService } from 'src/app/services/common/shop-information.service';

@Component({
  selector: 'app-account-sidebar',
  templateUrl: './account-sidebar.component.html',
  styleUrls: ['./account-sidebar.component.scss']
})
export class AccountSidebarComponent implements OnInit, OnDestroy {

  // Store Data
  user: User | any;
  shopInfo: ShopInformation | any;
  isOpen = false;

  // Static Data
  imagePlaceholder: string = 'assets/images/brand/jpg/images.jpg';

  // Subscriptions
  private subGetData!: Subscription;

  // Inject
  private readonly dialog = inject(MatDialog);
  private readonly userService = inject(UserService);
  private readonly userDataService = inject(UserDataService);
  private readonly reloadService = inject(ReloadService);
  private readonly shopService = inject(ShopInformationService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);


  ngOnInit(): void {
    // Reload
    this.subGetData = this.reloadService.refreshData$.subscribe(() => {
      this.getLoggedInUserInfo();
    })

    // Base Data
    this.getLoggedInUserInfo();
    this.getShopInformation();

    // GET DATA FORM PARAM
    this.activatedRoute.queryParamMap.subscribe((res) => {
      if (res.get('dialogOpen') !== null) {
        if (res.get('dialogOpen') === 'true') {
          this.isOpen = true;
        } else {
          this.dialog.closeAll();
        }
      } else {
        this.dialog.closeAll();
      }
    })
    this.dialog.afterAllClosed.subscribe(() => {
      this.router.navigate([], { queryParams: { dialogOpen: null }, queryParamsHandling: 'merge' });
    });
  }

  /**
   * HTTP REQ HANDLE
   * getLoggedInUserInfo()
   * userLogOut()
   * onShowProfile()
   */
  private getLoggedInUserInfo() {
    this.subGetData = this.userDataService.getLoggedInUserData().subscribe({
      next: res => {
        this.user = res.data;
        if (this.user?.profileImg) {
          this.imagePlaceholder = this.user?.profileImg;
        }
      },
      error: err => {
        console.log(err);
      }
    });
  }

  private getShopInformation() {
    this.subGetData = this.shopService.getShopInformation().subscribe({
      next: res => {
        this.shopInfo = res.data;
      },
      error: err => {
        console.log(err);
      }
    })
  }

  userLogOut() {
    this.userService.userLogOut();
  }


  /**
   * On Destroy
   */
  ngOnDestroy(): void {
    if (this.subGetData) {
      this.subGetData.unsubscribe();
    }
  }

}
