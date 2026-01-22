import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors} from '@angular/forms';
import {Router} from '@angular/router';
import {User} from '../../../interfaces/common/user.interface';
import {UserService} from '../../../services/common/user.service';
import {OtpService} from '../../../services/common/otp.service';
import {UiService} from '../../../services/core/ui.service';
import {UtilsService} from '../../../services/core/utils.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {

  dataForm!: FormGroup;
  hasUser: boolean = null;
  isLoading = false;
  isOtpSent: boolean = false;
  isOtpValid: boolean = false;
  sendVerificationCode: boolean = false;
  isPasswordShow = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    public otpService: OtpService,
    public uiService: UiService,
    private utilsService: UtilsService,
  ) {

  }

  ngOnInit() {
    this.onFormInit();
  }

  /**
   * FORM INITIALIZE
   * onFormInit()
   * onSubmit()
   */
  onFormInit() {
    this.dataForm = this.fb.group({
      username: ['', [Validators.required, ResetPasswordComponent.mobileOrEmailValidator]],
      otp: [null],
      password: [null],
    })
  }

  // Custom Validator function for mobile/email
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

  // Remove spaces from input
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

  // Update password validation when password field is shown
  updatePasswordValidation() {
    const passwordControl = this.dataForm.get('password');
    const otpControl = this.dataForm.get('otp');

    if (this.isOtpSent) {
      passwordControl?.setValidators([Validators.required, Validators.minLength(6)]);
      otpControl?.setValidators([Validators.required]);
    } else {
      passwordControl?.clearValidators();
      otpControl?.clearValidators();
    }

    passwordControl?.updateValueAndValidity();
    otpControl?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.dataForm.valid) {
      if (!this.isOtpSent) {
        this.checkUserForRegistration(this.dataForm.value)
      } else {
        const isEmail = this.utilsService.validateEmail(this.dataForm.value.username);
        if (isEmail) {
          this.validateOtpWithEmail({
            email: this.dataForm.value.username,
            code: this.dataForm.value.otp.toString(),
            password: this.dataForm.value.password,
          });
        } else {
          this.validateOtpWithPhoneNo({
            phoneNo: this.dataForm.value.username,
            code: this.dataForm.value.otp,
            password: this.dataForm.value.password,
          });
        }

      }

    } else {
      this.dataForm.markAllAsTouched();
    }
  }

  onShowPassword() {
    this.isPasswordShow = !this.isPasswordShow;
  }

  /**
   * HTTP REQ HANDLE
   * generateOtpWithPhoneNo()
   * validateOtpWithPhoneNo()
   */

  generateOtpWithPhoneNo(phoneNo: string) {
    this.isLoading = true;
    this.otpService.generateOtpWithPhoneNo(phoneNo)
      .subscribe({
        next: ((res) => {
          if (res.success) {
            this.isOtpSent = true;
            this.uiService.success(res.message);
            this.isLoading = false;
            this.sendVerificationCode = true;
            this.updatePasswordValidation(); // Update password validation
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
    this.otpService.generateOtpWithEmail(email)
      .subscribe({
        next: ((res) => {
          if (res.success) {
            this.isOtpSent = true;
            this.uiService.success(res.message);
            this.isLoading = false;
            this.sendVerificationCode = true;
            this.updatePasswordValidation(); // Update password validation
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

  validateOtpWithPhoneNo(data: { phoneNo: string, code: string, password: string }) {
    this.isLoading = true;
    this.otpService.validateOtpWithPhoneNo(data)
      .subscribe({
        next: ((res) => {
          if (res.success) {
            this.isOtpValid = true;
            this.sendVerificationCode = false;

            const user: any = {
              username: data.phoneNo,
              password: data.password,
            }
            this.resetUserPassword(user)


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


  validateOtpWithEmail(data: { email: string, code: string, password: string }) {
    this.isLoading = true;
    this.otpService.validateOtpWithEmail(data)
      .subscribe({
        next: ((res) => {
          if (res.success) {
            this.isOtpValid = true;
            this.sendVerificationCode = false;

            const user: any = {
              username: data.email,
              password: data.password,
            }
            this.resetUserPassword(user)


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


  private checkUserForRegistration(data: User) {
    this.userService.checkUserForRegistration(data.username).subscribe({
      next: res => {
        this.hasUser = res.data.hasUser
        if (res.data.hasUser) {
          this.hasUser = res.data.hasUser
          const isEmail = this.utilsService.validateEmail(data.username);
          if (isEmail) {
            this.generateOtpWithEmail(data.username)
          } else {
            this.generateOtpWithPhoneNo(data.username)
          }

        } else {
          this.uiService.warn('No user data found!')
        }
      },
      error: err => {
        console.log(err)
      }
    })
  }

  private resetUserPassword(data: any) {
    this.userService.resetUserPassword(data).subscribe({
      next: res => {
        this.isLoading = false;
        if (res.success) {
          this.uiService.warn('Success! Please login again');
          this.router.navigate(['/login']).then();
        } else {
          this.uiService.warn('Sorry! Something went wrong.');
        }
      },
      error: err => {
        this.isLoading = false;
        console.log(err)
      }
    })
  }


}
