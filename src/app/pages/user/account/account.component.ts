import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/interfaces/common/user.interface';
import { UserDataService } from 'src/app/services/common/user-data.service';
import { UserService } from 'src/app/services/common/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  // Font Awesome Icon
  faPen = faPen

  // Store Data
  user: User | any = null;
  imgPlaceHolder = "assets/images/brand/jpg/images.jpg";

  // Subscriptions
  private subGetData: Subscription;

  // Inject
  private readonly userDataService = inject(UserDataService);
  private readonly userService = inject(UserService);

  ngOnInit(): void {
    this.getLoggedInUserInfo();
  }

  private getLoggedInUserInfo() {
    this.subGetData = this.userDataService.getLoggedInUserData().subscribe({
      next: (res) => {
        this.user = res.data;
        if (this.user?.profileImg) {
          this.imgPlaceHolder = this.user.profileImg;
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  userLogOut() {
    this.userService.userLogOut();
  }

  ngOnDestroy(): void {
    if (this.subGetData) {
      this.subGetData.unsubscribe();
    }
  }
}
