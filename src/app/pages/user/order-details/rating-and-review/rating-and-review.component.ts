import {Component, Inject, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm} from '@angular/forms';

import {Subscription} from 'rxjs';

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {ActivatedRoute, Router} from '@angular/router';
import {ProductReview} from "../../../../interfaces/common/product-review.interface";
import {UiService} from "../../../../services/core/ui.service";
import {UserService} from "../../../../services/common/user.service";
import {UtilsService} from "../../../../services/core/utils.service";
import {FileUploadService} from "../../../../services/gallery/file-upload.service";
import {UserDataService} from "../../../../services/common/user-data.service";
import {ReloadService} from "../../../../services/core/reload.service";
import {User} from "../../../../interfaces/common/user.interface";
import {ProductReviewService} from "../../../../interfaces/common/product-review.service";

@Component({
  selector: 'app-rating-and-review',
  templateUrl: './rating-and-review.component.html',
  styleUrls: ['./rating-and-review.component.scss']
})
export class RatingAndReviewComponent implements OnInit, OnDestroy {

  // Rating
  @Input() pageUrl: string = null;
  @Input() productId: string = null;
  @Input() rating = 0;



  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  // Store Data
  id?: string;
  review?: ProductReview;
  // Image Upload
  files: File[] = [];
  pickedImage: any[] = [];
  oldImages: string[] = [];
  removeImage: string;
  user: User = null;

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour: Subscription;
  private subDataFive: Subscription;
  private subDataSix: Subscription;
  private subRouteOne: Subscription;
  private subAutoSlug: Subscription;

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    public userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fileUploadService: FileUploadService,
    public userDataService: UserDataService,
    public reloadService: ReloadService,
    public utilsService: UtilsService,
    public reviewService: ProductReviewService,
    public dialogRef: MatDialogRef<RatingAndReviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    // Init Form
    this.initDataForm();

    this.id = this.data
    this.getLoggedInUserInfo();

  }

  /**
   * FORM METHODS
   * initDataForm()
   * setFormValue()
   * onSubmit()
   */

  private initDataForm() {
    this.dataForm = this.fb.group({
      // user: [null],
      product: [null],
      // userName: [null],
      name: [null],
      review: [null],
      rating: [null],
      reviewDate: [null],
      replyDate: [null],
      status: false,
      like: 0,
      dislike: 0,
      images: null,

    });
  }



  private getLoggedInUserInfo() {
    this.subDataOne = this.userDataService.getLoggedInUserData()
      .subscribe(res => {
        if (res) {
          this.user = res.data;
          this.dataForm.patchValue(this.user);
        }
      }, error => {
        console.log(error);
      });
  }

  onRatingChanged(rating) {
    this.rating = rating;
  }


  onSubmit() {
    if (this.dataForm.invalid) {

      this.uiService.warn('Please filed all the required field');
      return;
    }
    if (!this.rating && this.rating <= 0) {

      this.uiService.warn('Please select your review');
      return;
    }
      // if (this.review) {
      //   if (this.files && this.files.length) {
      //     this.updateCategoryWithImage();
      //   } else {
      //     this.updateCategoryById();
      //   }
    // }
    else {
      if (this.files && this.files.length) {
        this.addReviewWithImage();
      } else {
        this.addReview();
      }
    }
  }



  /**
   * RESET
   */
  private reset() {
    this.rating = 0;
    // this.formElRef.resetForm();
  }

  /**
   * HTTP REQ HANDLE
   * getCategoryById()
   * addCategory()
   * updateCategoryById()
   * removeSingleFile()
   */

  private addReview() {

    const mData = {
      ...this.dataForm.value,
      ...{
        rating: this.rating,
        reviewDate: this.utilsService.getDateString(new Date()),
        product:  this.id,
      }
    }
    this.subDataOne = this.reviewService.addReview(mData)
      .subscribe({
        next: (res => {
          this.uiService.success('Your review is under process');
          this.reloadService.needRefreshData$();
          this.reset();
          this.files=[];
          this.dialogRef.close();
        }),
        error: (error => {
          console.log(error);
        })
      });
  }





  private removeSingleFile(data: string) {
    this.subDataFour = this.fileUploadService.removeSingleFile(data).subscribe({
      next: (res) => {
        // console.log(res);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  /**
   * IMAGE UPLOAD
   * onSelect()
   * onRemove()
   * addCategoryWithImage()
   * updateCategoryWithImage()
   * removeSelectImage()
   * removeOldImage()
   */

  onSelect(event: { addedFiles: any }) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event: File) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  private addReviewWithImage() {
    this.subDataFive = this.fileUploadService
      .uploadMultiImageOriginal(this.files)
      .subscribe((res) => {
        const images = res.map((m) => m.url);
        this.dataForm.patchValue({ images: images });
        this.addReview();
      });
  }



  // removeSelectImage(index: number) {
  //   if (this.files && this.files.length) {
  //     this.files.splice(index - this.oldImages.length, 1);
  //     this.pickedImage.splice(index, 1);
  //   } else {
  //     this.oldImages.splice(index, 1);
  //     this.pickedImage.splice(index, 1);
  //   }
  // }

  removeOldImage(index: number) {
    this.removeImage = this.oldImages[index];
    this.oldImages.splice(index, 1);
    this.dataForm.patchValue({ image: null });
  }




  /**
   * ON DESTROY
   * ngOnDestroy()
   */

  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
    if (this.subDataTwo) {
      this.subDataTwo.unsubscribe();
    }
    if (this.subDataThree) {
      this.subDataThree.unsubscribe();
    }
    if (this.subDataFour) {
      this.subDataFour.unsubscribe();
    }
    if (this.subDataFive) {
      this.subDataFive.unsubscribe();
    }
    if (this.subDataSix) {
      this.subDataSix.unsubscribe();
    }
    if (this.subRouteOne) {
      this.subRouteOne.unsubscribe();
    }
    if (this.subAutoSlug) {
      this.subAutoSlug.unsubscribe();
    }
  }

}
