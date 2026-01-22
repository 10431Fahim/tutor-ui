import {Component, ElementRef, inject, OnInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import {OtpService} from "../../../services/common/otp.service";
import {UiService} from "../../../services/core/ui.service";
import {UserService} from "../../../services/common/user.service";
import {ActivatedRoute} from "@angular/router";
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {User} from "../../../interfaces/common/user.interface";
import {UtilsService} from "../../../services/core/utils.service";

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {
  // Google and fb login
  @ViewChild('googleLoginRef', {static: true}) loginElement!: ElementRef;
  countDown = 0;
  isCountDownEnd = false;
  timeInstance = null;
  // Store Data
  navigateFrom: string | undefined;
  phoneNo: string | any = null;
  password: string | any = null;
  otpCode: string | any;
  hasUser: boolean = false;
  isPass: boolean = false;
  showBtn: boolean = false;
  isPasswordShow = false;
  // Store Data
  isOtpSent: boolean = false;
  isOtpValid: boolean = false;
  // isLoading = false;
  public sendVerificationCode = false;
  dataForm!: FormGroup;
  // Loader
  isLoading: boolean = false;
  private subOtpGenerate: Subscription;
  private subOtpValidate: Subscription;
  // Inject
  private readonly otpService = inject(OtpService);
  private readonly uiService = inject(UiService);
  private readonly userService = inject(UserService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly utilsService = inject(UtilsService);
  private readonly cdr = inject(ChangeDetectorRef);


  ngOnInit(): void {
    this.onFormInit();
    // GET DATA FORM PARAM
    this.activatedRoute.queryParamMap.subscribe(qParam => {
      if (qParam.get('navigateFrom')) {
        this.navigateFrom = qParam.get('navigateFrom') || '';
        console.log("this.navigateFrom",this.navigateFrom)
      }
    })
  }


  /**
   * FORM INITIALIZE
   * onFormInit()
   * onSubmit()
   */
  onFormInit() {
    this.dataForm = this.fb.group({
      phoneNo: [null],
      name: [null],
      username: ['', [Validators.required, UserLoginComponent.mobileOrEmailValidator]],
      password: [null],
      otp: [null],
    })
  }

  // Update password validation when password field is shown
  updatePasswordValidation() {
    const passwordControl = this.dataForm.get('password');
    const otpControl = this.dataForm.get('otp');

    if (this.isPass) {
      passwordControl?.setValidators([Validators.required, Validators.minLength(6)]);
    } else {
      passwordControl?.clearValidators();
    }

    if (this.isOtpSent) {
      otpControl?.setValidators([Validators.required]);
    } else {
      otpControl?.clearValidators();
    }

    passwordControl?.updateValueAndValidity();
    otpControl?.updateValueAndValidity();
  }

  // Custom Validator function without using 'this'
  static mobileOrEmailValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';

    // If empty, don't validate yet (let required validator handle it)
    if (!value || value.trim() === '') {
      return null;
    }

    // Email validation pattern (matching utilsService pattern)
    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const isEmail = emailPattern.test(value);

    // Mobile validation pattern (Bangladesh mobile numbers)
    const mobilePattern = /^(?:\+88|88)?(01[3-9]\d{8})$/;
    const isMobile = mobilePattern.test(value);

    // If neither email nor mobile, return error
    if (!isEmail && !isMobile) {
      return { invalidInput: true };
    }

    // Apply specific validators based on type
    if (isEmail) {
      // Email-specific validation
      if (value.length > 254) { // RFC 5321 limit
        return { emailTooLong: true };
      }
      // Additional email validation checks
      const emailParts = value.split('@');
      if (emailParts.length !== 2) {
        return { invalidEmail: true };
      }
      const localPart = emailParts[0];
      const domainPart = emailParts[1];

      // Check local part length (max 64 characters)
      if (localPart.length > 64) {
        return { invalidEmail: true };
      }

      // Check domain part length (max 253 characters)
      if (domainPart.length > 253) {
        return { invalidEmail: true };
      }
    }

    if (isMobile) {
      // Mobile-specific validation
      const mobileOnly = value.replace(/^(\+88|88)/, '');

      // Check if it's exactly 11 digits
      if (mobileOnly.length !== 11) {
        return { invalidMobile: true };
      }

      // Check if it's a valid Bangladesh mobile number
      if (!/^01[3-9]\d{8}$/.test(mobileOnly)) {
        return { invalidMobile: true };
      }

      // Check if it starts with valid Bangladesh mobile prefixes
      const validPrefixes = ['013', '014', '015', '016', '017', '018', '019'];
      const prefix = mobileOnly.substring(0, 3);
      if (!validPrefixes.includes(prefix)) {
        return { invalidMobile: true };
      }
    }

    return null;
  }

  // Password validator for minimum 6 characters
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    if (value && value.length < 6) {
      return { minLength: { requiredLength: 6, actualLength: value.length } };
    }
    return null;
  }

  // Check if form is valid based on current state
  isFormValid(): boolean {
    const usernameValid = this.dataForm.get('username')?.valid;
    const passwordValid = this.isPass ? this.dataForm.get('password')?.valid : true;
    const otpValid = this.isOtpSent ? this.dataForm.get('otp')?.valid : true;

    return usernameValid && passwordValid && otpValid;
  }
  // Helper function to check if input is a valid email
  isEmail(value: string): boolean {
    if (!value || value.trim() === '') {
      return false;
    }
    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailPattern.test(value)) {
      return false;
    }

    // Additional email validation checks
    const emailParts = value.split('@');
    if (emailParts.length !== 2) {
      return false;
    }
    const localPart = emailParts[0];
    const domainPart = emailParts[1];

    // Check lengths
    if (localPart.length > 64 || domainPart.length > 253 || value.length > 254) {
      return false;
    }

    return true;
  }

  // Helper function to check if input is a valid mobile number
  isMobileNumber(value: string): boolean {
    if (!value || value.trim() === '') {
      return false;
    }

    // Remove country code if present
    const mobileOnly = value.replace(/^(\+88|88)/, '');

    // Check if it's exactly 11 digits
    if (mobileOnly.length !== 11) {
      return false;
    }

    // Check if it's a valid Bangladesh mobile number
    if (!/^01[3-9]\d{8}$/.test(mobileOnly)) {
      return false;
    }

    // Check if it starts with valid Bangladesh mobile prefixes
    const validPrefixes = ['013', '014', '015', '016', '017', '018', '019'];
    const prefix = mobileOnly.substring(0, 3);
    if (!validPrefixes.includes(prefix)) {
      return false;
    }

    return true;
  }

  removeSpaces(event: any): void {
    const input = event.target;
    input.value = input.value.replace(/\s/g, '');  // Remove spaces from input
    this.dataForm.get('username')?.setValue(input.value);
  }

  // Handle OTP input to ensure only digits are allowed
  onOtpInput(event: any): void {
    const input = event.target;
    const value = input.value;

    // Remove any non-digit characters
    const digitsOnly = value.replace(/[^0-9]/g, '');

    // Limit to 6 digits
    const limitedValue = digitsOnly.slice(0, 6);

    // Update the input value if it changed
    if (value !== limitedValue) {
      input.value = limitedValue;
      this.dataForm.get('otp')?.setValue(limitedValue);
    }
  }

  // Optional: Input event handler if you want to take any actions on input change
  onInput(event: any): void {
    const value = event.target.value;
    if (this.isMobileNumber(value)) {
      event.target.maxLength = 11;
    }
  }
  /**
   * INPUT METHODS
   * onSubmitData()
   * onEnterOtp()
   * onChangePhoneNo()
   */

  onSubmitData(){
    const isEmail = this.utilsService.validateEmail(this.dataForm.value.username);
    if (isEmail) {
      this.validateOtpWithEmail({
        email: this.dataForm.value.username,
        code: this.dataForm.value.otp.toString(),
        // password: this.dataForm.value.password,
      });
    } else {
      this.validateOtpWithPhoneNo({
        phoneNo: this.dataForm.value.username,
        code: this.dataForm.value.otp.toString(),
        // password: this.dataForm.value.password,
      });
    }
  }

  onShowPassword() {
    this.isPasswordShow = !this.isPasswordShow;
  }

  // Back button functionality
  onBackButtonClick() {
    // Reset OTP and password states
    this.isOtpSent = false;
    this.isPass = false;
    this.showBtn = false;
    this.isOtpValid = false;
    this.sendVerificationCode = false;
    this.countDown = 0;
    this.isCountDownEnd = false;

    // Clear OTP and password fields
    this.dataForm.patchValue({
      otp: null,
      password: null
    });

    // Update password validation
    this.updatePasswordValidation();

    // Clear any existing timers
    if (this.timeInstance) {
      clearInterval(this.timeInstance);
      this.timeInstance = null;
    }

    // Force change detection
    this.cdr.detectChanges();
  }

  // Resend OTP functionality
  resendOtp() {
    const username = this.dataForm.get('username')?.value;
    if (!username) {
      this.uiService.warn('Please enter a valid mobile number or email address');
      return;
    }

    // Clear previous OTP and reset countdown
    this.dataForm.patchValue({ otp: null });
    this.countDown = 0;
    this.isCountDownEnd = false;

    // Clear any existing timers
    if (this.timeInstance) {
      clearInterval(this.timeInstance);
      this.timeInstance = null;
    }

    // Check if it's email or mobile and resend accordingly
    const isEmail = this.utilsService.validateEmail(username);
    if (isEmail) {
      this.generateOtpWithEmail(username);
    } else {
      this.generateOtpWithPhoneNo(username);
    }
  }

  onSubmit() {
    if (this.isFormValid()) {
      this.checkUserForRegistration(this.dataForm.value)
    } else {
      this.dataForm.markAllAsTouched();
    }
  }

  private checkUserForRegistration(data: User) {
    this.userService.checkUserForRegistration(data.username).subscribe({
      next: async res => {
        this.hasUser = res.data.hasUser
        if (res.data.hasUser) {
          this.hasUser = res.data.hasUser;
          this.isPass = true;
          this.updatePasswordValidation(); // Update password validation
          this.cdr.detectChanges(); // Force change detection
          try {
            if(this.dataForm.value.password){
              await this.userService.userLogin(this.dataForm.value,this.navigateFrom);
              this.isLoading = false;
            }
          } catch (e) {
            this.isLoading = false;
          }
        } else {
          if (!this.otpCode && !this.isOtpSent) {
            const isEmail = this.utilsService.validateEmail(data.username);
            this.showBtn = true;
            if (isEmail) {
              this.generateOtpWithEmail(data.username)
            } else {
              this.generateOtpWithPhoneNo(data.username)
            }
          }
          // this.uiService.warn('No user data found!')
        }
      },
      error: err => {
        console.log(err)
      }
    })
  }
// CountDown...
  countTime(time?) {
    // Clear any existing timer first
    if (this.timeInstance) {
      clearInterval(this.timeInstance);
    }

    let count = time || 60;
    this.countDown = count;
    this.isCountDownEnd = false;

    this.timeInstance = setInterval(() => {
      this.countDown = count;
      count--;

      if (count < 0) {
        clearInterval(this.timeInstance);
        this.countDown = 0;
        this.isCountDownEnd = true;
        this.timeInstance = null;
      }
    }, 1000);
  }

  validateOtpWithPhoneNo(data: { phoneNo: string, code: string }) {
    this.isLoading = true;
    this.subOtpValidate = this.otpService.validateOtpWithPhoneNo(data)
      .subscribe({
        next: (async (res) => {
          if (res.success) {
            this.isOtpValid = true;
            this.sendVerificationCode = false;
            this.isLoading = false;

            const user: User = {
              phoneNo: data.phoneNo,
              username: data.phoneNo,
              name: this.dataForm.value.name,
              password: this.dataForm.value.password,
              registrationType: 'phone',
              hasAccess: true,
            }

            try {

              await this.userService.userSignupAndLogin(user, this.navigateFrom);
              this.isLoading = false;
            } catch (e) {
              this.isLoading = false;
            }


          } else {
            this.isOtpValid = false;
            this.isLoading = false;
            this.uiService.warn(res.message);
          }
        }),
        error: ((error) => {
          this.isOtpValid = false;
          this.isLoading = false;
          console.log(error);
        })
      });
  }

  validateOtpWithEmail(data: { email: string, code: string }) {
    this.isLoading = true;
    this.subOtpValidate = this.otpService.validateOtpWithEmail(data)
      .subscribe({
        next: (async (res) => {
          if (res.success) {
            this.isOtpValid = true;
            this.sendVerificationCode = false;
            this.isLoading = false;

            const user: User = {
              phoneNo: null,
              email: data.email,
              username: data.email,
              name: this.dataForm.value.name,
              password: this.dataForm.value.password,
              registrationType: 'email',
              hasAccess: true,
            }

            try {

              await this.userService.userSignupAndLogin(user, this.navigateFrom);
              this.isLoading = false;
            } catch (e) {
              this.isLoading = false;
            }


          } else {
            this.isOtpValid = false;
            this.isLoading = false;
            this.uiService.warn(res.message);
          }
        }),
        error: ((error) => {
          this.isOtpValid = false;
          this.isLoading = false;
          console.log(error);
        })
      });
  }


  /**
   * HTTP REQ HANDLE
   * generateOtpWithPhoneNo()
   * validateOtpWithPhoneNo()
   */

  generateOtpWithPhoneNo(phoneNo: string) {
    this.isLoading = true;
    this.countTime(60);
    this.subOtpGenerate = this.otpService.generateOtpWithPhoneNo(phoneNo)
      .subscribe({
        next: ((res) => {
          if (res.success) {
            this.isOtpSent = true;
            this.uiService.success(res.message);
            this.isLoading = false;
            this.isPass = true;
            this.updatePasswordValidation(); // Update password validation
            this.sendVerificationCode = true;
            this.cdr.detectChanges(); // Force change detection
          } else {
            this.isOtpSent = false;
            this.uiService.warn(res.message);
          }
        }),
        error: ((error) => {
          this.isOtpSent = false;
          this.isLoading = false;
          console.log(error);
        })
      });
  }

  generateOtpWithEmail(email: string) {
    this.isLoading = true;
    this.countTime(60);
    this.subOtpGenerate = this.otpService.generateOtpWithEmail(email)
      .subscribe({
        next: ((res) => {
          if (res.success) {
            this.isOtpSent = true;
            this.isPass = true;
            this.showBtn = true;
            this.uiService.success(res.message);
            this.isLoading = false;
            this.updatePasswordValidation(); // Update password validation
            this.sendVerificationCode = true;
            this.cdr.detectChanges(); // Force change detection
          } else {
            this.isOtpSent = false;
            this.uiService.warn(res.message);
          }
        }),
        error: ((error) => {
          this.isOtpSent = false;
          this.isLoading = false;
          console.log(error);
        })
      });
  }
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
