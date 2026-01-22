import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Quiz } from '../../../../interfaces/common/quiz.interface';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { Course } from '../../../../interfaces/common/course.interface';
import { UiService } from '../../../../services/core/ui.service';
import { Router } from '@angular/router';
import { User } from '../../../../interfaces/common/user.interface';
import { PricePipe } from '../../../../shared/pipes/price.pipe';
import { UserService } from '../../../../services/common/user.service';
import { UtilsService } from '../../../../services/core/utils.service';
import { Order } from '../../../../interfaces/common/order.interface';
import { Subscription } from 'rxjs';
import { OrderService } from '../../../../services/common/order.service';
import { environment } from '../../../../../environments/environment';
import { PaymentService } from '../../../../services/common/payment.service';
import { DOCUMENT } from '@angular/common';
import { QuizService } from 'src/app/services/common/quiz.service';

@Component({
  selector: 'app-quiz-result',
  templateUrl: './quiz-result.component.html',
  styleUrls: ['./quiz-result.component.scss'],
  providers: [PricePipe],
})
export class QuizResultComponent implements OnInit {
  // Font Awesome Icon
  faAngleDown = faAngleDown;

  @Input() quiz: Quiz;
  @Input() result: any = false;
  @Input() course: Course;

  @Output() onReQuiz = new EventEmitter();

  // quiz result show variable
  quizRes: boolean = false;
  @Input() user: User;

  // Loader
  isLoading: boolean = false;

  private readonly uiService = inject(UiService);
  private readonly router = inject(Router);
  private readonly pricePipe = inject(PricePipe);
  private readonly userService = inject(UserService);
  private readonly utilService = inject(UtilsService);
  private readonly orderService = inject(OrderService);
  private readonly paymentService = inject(PaymentService);
  private readonly quizService = inject(QuizService);
  private readonly document = inject(DOCUMENT);


  // Subscriptions
  private subAddData1!: Subscription;
  private subAddData2!: Subscription;

  ngOnInit() {

  }

  /**
   * SHOW QUIZ RESULT
   * onQuizRes()
   */
  onQuizRes() {
    this.quizRes = !this.quizRes;
  }

  onClickReQuiz() {
    this.onReQuiz.emit(true);
  }


  /**
   * COURSE ENROLL
   */
  public onBuyCourse() {

    if (this.course.type === 'live-course' && this.course.tag?.name.toLowerCase() === 'admission' && !this.course.isAdmission) {
      this.uiService.warn('Admission is not open yet. Please wait until open date');
      return;
    }

    if (this.course.type === 'live-course' && this.course.tag?.name.toLowerCase() === 'admission' && this.course.isAdmission && this.course.question) {
      this.uiService.warn('Please answer this question before enroll.');
      this.router.navigate(['/quiz', this.course.question?._id], {
        queryParams: { course: this.course._id },
        queryParamsHandling: 'merge'
      })
      return;
    }


    this.isLoading = true;

    const mData: any = {
      name: this.user?.name,
      email: this.user?.email,
      phoneNo: this.user?.phone,
      approveStatus: 'not-approved',
      paymentStatus:
        this.pricePipe.transform(
          this.course,
          'salePrice',
          null
        ) > 0
          ? 'unpaid'
          : 'paid',
      orderStatus:
        this.pricePipe.transform(
          this.course,
          'salePrice',
          null
        ) > 0
          ? 'Pending'
          : 'Delivered',
      subTotal: this.pricePipe.transform(
        this.course,
        'regularPrice',
        null
      ),
      discount: this.pricePipe.transform(
        this.course,
        'discountAmount',
        null
      ),

      grandTotal: this.pricePipe.transform(
        this.course,
        'salePrice',
        null
      ),
      paidAmount: 0,
      coupon: null,
      couponDiscount: 0,
      checkoutDate: this.utilService.getDateString(new Date()),
      note: null,
      user: this.userService.getUserId(),
      orderType: this.course?.type,
      liveCourseCode: null,
      orderItem: {
        _id: this.course._id,
        name: this.course?.name,
        slug: this.course?.slug,
        type: this.course?.type,
        image: this.course?.bannerImage
          ? this.course?.bannerImage
          : this.course?.image,
        category: this.course?.category,
        subCategory: this.course?.subCategory,
        childCategory: this.course?.childCategory,
        specifications: this.course?.specifications,
        salePrice: this.pricePipe.transform(
          this.course,
          'salePrice',
          null
        ),
        discountType: this.course.discountType,
        discountAmount: this.course.discountAmount,
        unit: null
      },
    };

    if (this.userService.getUserStatus()) {

      this.addOrderByUser(mData);
    } else {
      this.isLoading = false;
      this.router
        .navigate(['/login'], {
          queryParams: { navigateFrom: this.router.url },
        })
        .then();
    }
  }

  private addOrderByUser(data: Order) {
    this.subAddData1 = this.orderService.addOrderByUser(data).subscribe({
      next: (res) => {
        if (res.success) {
          if (data.grandTotal > 0) {
            this.bKashCreatePayment(data, res.data?._id);
          } else {
            this.uiService.success('Course added to your enroll list');
            this.router.navigate(['/my-course']);
          }
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  private bKashCreatePayment(orderData: Order, _id: string) {
    this.isLoading = true;

    const reqData = {
      mode: '0011',
      payerReference: ' ',
      callbackURL: environment.bkashCallbackUrl,
      amount: orderData.grandTotal,
      currency: 'BDT',
      intent: 'sale',
      merchantInvoiceNumber: _id, // Must be unique
    };

    this.paymentService.createBkashPayment(reqData).subscribe({
      next: (res) => {
        if (res.success) {
          const updateData = {
            paymentMethod: 'bKash',
            paymentApiType: 'bKash',
            paymentRefId: res.data.paymentID,
          };
          this.updateOrderByUserId(_id, updateData, res.data.bkashURL);
        } else {
          this.isLoading = false;
          this.uiService.warn('Something went wrong! Please try again.');
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  private updateOrderByUserId(
    _id: string,
    data: any,
    paymentRedirectUrl: string
  ) {
    this.subAddData1 = this.orderService
      .updateOrderByUserId(_id, data)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.document.location.href = paymentRedirectUrl;
          } else {
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
  }


  onEligibleForEnroll() {

    const data: any = {
      quiz: {
        _id: this.quiz._id,
        name: this.quiz.name,
        questionCount: this.quiz.questionCount,
        passMark: this.quiz.passMark,
        timeInSec: this.quiz.timeInSec,
      },
      user: {
        _id: this.user?._id,
        name: this.user?.name,
        username: this.user?.username,
        phoneNo: this.user?.phoneNo,
        email: this.user?.email,
      },
      mark: this.result.mark,
      isPass: this.result.isPass,
      completeTimeInSec: this.result.totalFinishTime,
      joinDate: new Date(),
      course: this.course._id,
    }

    console.log("hello data", data);

    this.addQuizResult(data);

  }


  private addQuizResult(data: any) {

    this.subAddData1 = this.quizService.addQuizResult(data).subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/course-details', this.course?._id], {queryParams: {redirectFrom: 'question'}, queryParamsHandling: 'merge'})
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }


  /**
   * On Destroy
   */
  ngOnDestroy(): void {
    if (this.subAddData1) {
      this.subAddData1.unsubscribe();
    }
    if (this.subAddData2) {
      this.subAddData2.unsubscribe();
    }
  }


}
