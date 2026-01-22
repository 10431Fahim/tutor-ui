import { Component, OnInit, inject } from '@angular/core';
import { OtpService } from '../../../services/common/otp.service';
import { UiService } from '../../../services/core/ui.service';
import { UserService } from '../../../services/common/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // Store Data
  navigateFrom: string | undefined;
  phoneNo: string | any = null;
  sentOtp: boolean | any = false;
  otpCode: string | any;

  // Loader
  isLoading: boolean = false;

  // Inject
  private readonly otpService = inject(OtpService);
  private readonly uiService = inject(UiService);
  private readonly userService = inject(UserService);
  private readonly activatedRoute = inject(ActivatedRoute);


  ngOnInit(): void {
    // GET DATA FORM PARAM
    this.activatedRoute.queryParamMap.subscribe(qParam => {
      if (qParam.get('navigateFrom')) {
        this.navigateFrom = qParam.get('navigateFrom') as string;
      }
    })
  }

  /**
   * INPUT METHODS
   * onSubmitData()
   * onEnterOtp()
   * onChangePhoneNo()
   */
  // async onSubmitData() {
  //   if (this.phoneNo && this.phoneNo.length === 11) {
  //     if (!this.otpCode && !this.sentOtp) {
  //       this.generateOtpWithPhoneNo();
  //     } else {
  //       if (this.otpCode && this.otpCode.length === 4) {
  //         this.isLoading = true;
  //         await this.validateOtpWithPhoneNo();
  //       } else {
  //         this.uiService.warn('Please enter valid otp')
  //       }
  //     }
  //   } else {
  //     this.uiService.warn('Phone no must be 11 digit')
  //   }
  // }

  onEnterOtp(event: string) {
    this.otpCode = event;
  }

  onChangePhoneNo() {
    this.sentOtp = false;
    this.otpCode = null;
  }

  /**
   * HTTP REQ HANDLE
   * generateOtpWithPhoneNo()
   * validateOtpWithPhoneNo()
   */
  private generateOtpWithPhoneNo() {
    this.otpService.generateOtpWithPhoneNo(this.phoneNo).subscribe({
      next: res => {
        this.isLoading = false;
        if (res.success) {
          this.sentOtp = true;
          this.uiService.success(res.message)
        } else {
          this.uiService.warn(res.message);
        }
      },
      error: err => {
        console.log(err);
        this.isLoading = false;
      }
    })
  }

  // private async validateOtpWithPhoneNo() {
  //   this.otpService.validateOtpWithPhoneNo(this.phoneNo, this.otpCode).subscribe({
  //     next: res => {
  //       if (res.success) {
  //         this.uiService.success(res.message);
  //         this.userSignupOrLogin();
  //       } else {
  //         this.isLoading = false;
  //         this.uiService.warn(res.message);
  //       }
  //     },
  //     error: err => {
  //       console.log(err);
  //       this.isLoading = false;
  //     }
  //   })
  // }

  /**
   * USER LOGIN OR SIGNUP METHODS
   * userSignupOrLogin()
   */
  async userSignupOrLogin() {
    try {
      const data = {
        phone: this.phoneNo,
        registrationType: 'phone',
        hasAccess: true,
        isPasswordLess: true
      }
      await this.userService.userSignupOrLogin(data, this.navigateFrom);
      this.isLoading = false;
    } catch (err) {
      console.log(err);
      this.isLoading = false;
    }
  }

}
