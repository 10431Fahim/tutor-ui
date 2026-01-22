import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShopInformation } from "../../../interfaces/common/shop-information.interface";
import { Subscription } from "rxjs";
import { ShopInformationService } from "../../../services/common/shop-information.service";
import { ContactService } from "../../../services/common/contact.service";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit, OnDestroy {

  // Store Data
  shopInformation: ShopInformation;
  selectedTabIndex = 0; // Support tab is default (index 0)

  // Form Groups
  supportForm: FormGroup;
  detailsForm: FormGroup;

  // Subscriptions
  private subGetData: Subscription;
  private subContact: Subscription;

  // Inject
  private readonly shopInfoService = inject(ShopInformationService);
  private readonly contactService = inject(ContactService);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  constructor() {
    this.initializeForms();
  }

  ngOnInit(): void {
    // Base Data
    this.getShopInformation();
  }

  /**
   * Initialize Forms
   */
  private initializeForms() {
    // Support Form (Basic fields)
    this.supportForm = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      type: ['', [Validators.required]] // Course/Appointment/Seminar/exam
    });

    // Details Form (More fields)
    this.detailsForm = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      type: ['', [Validators.required]],
      course: [''], // Course-wise field
      message: [''] // Additional message/details
    });
  }

  /**
   * HTTP REQUEST HANDLE
   * getShopInformation()
   */
  private getShopInformation() {
    this.subGetData = this.shopInfoService.getShopInformation()
      .subscribe({
        next: res => {
          this.shopInformation = res.data;
        },
        error: err => {
          console.log(err)
        }
      })
  }

  /**
   * Submit Support Form
   */
  onSubmitSupport() {
    if (this.supportForm.invalid) {
      this.supportForm.markAllAsTouched();
      return;
    }

    const formData = {
      firstName: this.supportForm.value.name,
      phoneNo: this.supportForm.value.phone,
      email: this.supportForm.value.email,
      shortDesc: `Type: ${this.supportForm.value.type}`,
      formType: 'support',
      select: false
    };

    this.subContact = this.contactService.addContact(formData).subscribe({
      next: (res) => {
        this.snackBar.open('আপনার তথ্য সফলভাবে জমা দেওয়া হয়েছে', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.supportForm.reset();
      },
      error: (err) => {
        this.snackBar.open('একটি ত্রুটি ঘটেছে, অনুগ্রহ করে আবার চেষ্টা করুন', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        console.log(err);
      }
    });
  }

  /**
   * Submit Details Form
   */
  onSubmitDetails() {
    if (this.detailsForm.invalid) {
      this.detailsForm.markAllAsTouched();
      return;
    }

    const formData = {
      firstName: this.detailsForm.value.name,
      phoneNo: this.detailsForm.value.phone,
      email: this.detailsForm.value.email,
      shortDesc: `Type: ${this.detailsForm.value.type}, Course: ${this.detailsForm.value.course || 'N/A'}, Message: ${this.detailsForm.value.message || 'N/A'}`,
      formType: 'details',
      select: false
    };

    this.subContact = this.contactService.addContact(formData).subscribe({
      next: (res) => {
        this.snackBar.open('আপনার বিস্তারিত তথ্য সফলভাবে জমা দেওয়া হয়েছে', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.detailsForm.reset();
      },
      error: (err) => {
        this.snackBar.open('একটি ত্রুটি ঘটেছে, অনুগ্রহ করে আবার চেষ্টা করুন', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        console.log(err);
      }
    });
  }

  /**
  * On Destroy
  */
  ngOnDestroy(): void {
    if (this.subGetData) {
      this.subGetData.unsubscribe();
    }
    if (this.subContact) {
      this.subContact.unsubscribe();
    }
  }
}
