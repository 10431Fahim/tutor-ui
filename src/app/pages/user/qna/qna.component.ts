import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QnaService } from '../../../services/common/qna.service';
import { OrderService } from '../../../services/common/order.service';
import { UserDataService } from '../../../services/common/user-data.service';
import { UiService } from '../../../services/core/ui.service';
import { QnA } from '../../../interfaces/common/qna.interface';
import { FilterData } from '../../../interfaces/core/filter-data.interface';
import { Order } from '../../../interfaces/common/order.interface';
import { User } from '../../../interfaces/common/user.interface';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-qna',
  templateUrl: './qna.component.html',
  styleUrls: ['./qna.component.scss'],
})
export class QnaComponent implements OnInit, OnDestroy {
  // Form Groups
  courseQuestionForm: FormGroup;
  generalQuestionForm: FormGroup;

  // Store Data
  questions: QnA[] = [];
  enrolledCourses: Order[] = [];
  user: User | any = null;
  selectedTabIndex = 0; // 0 = Course, 1 = General
  selectedFilter: 'all' | 'pending' | 'answered' = 'all';

  // Loader
  isLoading = false;
  isSubmitting = false;

  // Subscriptions
  private subGetData: Subscription;
  private subAddData: Subscription;
  private subGetCourses: Subscription;

  // Inject
  private readonly qnaService = inject(QnaService);
  private readonly orderService = inject(OrderService);
  private readonly userDataService = inject(UserDataService);
  private readonly uiService = inject(UiService);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  constructor() {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.getLoggedInUserInfo();
    this.getEnrolledCourses();
    this.getAllQuestions();
  }

  /**
   * FORM INITIALIZATION
   * initializeForms()
   */
  private initializeForms() {
    this.courseQuestionForm = this.fb.group({
      courseId: ['', [Validators.required]],
      question: ['', [Validators.required, Validators.minLength(10)]],
    });

    this.generalQuestionForm = this.fb.group({
      question: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  /**
   * GET USER DATA
   * getLoggedInUserInfo()
   */
  private getLoggedInUserInfo() {
    this.subGetData = this.userDataService.getLoggedInUserData().subscribe({
      next: (res) => {
        this.user = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**
   * GET ENROLLED COURSES
   * getEnrolledCourses()
   */
  private getEnrolledCourses() {
    const filterData: FilterData = {
      filter: { orderStatus: 'Delivered' },
      select: {
        orderItem: 1,
        orderType: 1,
      },
      pagination: null,
      sort: { createdAt: -1 },
    };

    this.subGetCourses = this.orderService.getAllOrdersByUser(filterData).subscribe({
      next: (res) => {
        this.enrolledCourses = res.data || [];
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**
   * GET ALL QUESTIONS
   * getAllQuestions()
   */
  getAllQuestions() {
    this.isLoading = true;

    const filter: any = { askedBy: this.user?._id };
    if (this.selectedFilter !== 'all') {
      filter.status = this.selectedFilter;
    }

    const filterData: FilterData = {
      filter: filter,
      select: {
        question: 1,
        answer: 1,
        category: 1,
        courseId: 1,
        courseName: 1,
        status: 1,
        answerSource: 1,
        createdAt: 1,
        updatedAt: 1,
      },
      pagination: null,
      sort: { createdAt: -1 },
    };

    this.subGetData = this.qnaService.getAllQna(filterData).subscribe({
      next: (res) => {
        if (res.success) {
          this.questions = res.data || [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
        this.snackBar.open('প্রশ্নগুলো লোড করতে সমস্যা হয়েছে', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  /**
   * SUBMIT COURSE QUESTION
   * onSubmitCourseQuestion()
   */
  onSubmitCourseQuestion() {
    if (this.courseQuestionForm.invalid) {
      this.courseQuestionForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const selectedCourse = this.enrolledCourses.find(
      (c) => c.orderItem?._id === this.courseQuestionForm.value.courseId,
    );

    const questionData: QnA = {
      question: this.courseQuestionForm.value.question,
      category: 'course',
      courseId: this.courseQuestionForm.value.courseId,
      courseName: selectedCourse?.orderItem?.name || '',
      askedBy: this.user?._id,
      status: 'pending',
    };

    this.subAddData = this.qnaService.addQna(questionData).subscribe({
      next: (res) => {
        if (res.success) {
          this.snackBar.open('প্রশ্নটি সফলভাবে জমা দেওয়া হয়েছে', 'Close', {
            duration: 3000,
          });
          this.courseQuestionForm.reset();
          // Refresh questions after a short delay to allow AI to generate answer
          setTimeout(() => {
            this.getAllQuestions();
          }, 2000);
        }
        this.isSubmitting = false;
      },
      error: (err) => {
        console.log(err);
        this.isSubmitting = false;
        this.snackBar.open('প্রশ্ন জমা দেওয়ার সময় সমস্যা হয়েছে', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  /**
   * SUBMIT GENERAL QUESTION
   * onSubmitGeneralQuestion()
   */
  onSubmitGeneralQuestion() {
    if (this.generalQuestionForm.invalid) {
      this.generalQuestionForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const questionData: QnA = {
      question: this.generalQuestionForm.value.question,
      category: 'general',
      askedBy: this.user?._id,
      status: 'pending',
    };

    this.subAddData = this.qnaService.addQna(questionData).subscribe({
      next: (res) => {
        if (res.success) {
          this.snackBar.open('প্রশ্নটি সফলভাবে জমা দেওয়া হয়েছে', 'Close', {
            duration: 3000,
          });
          this.generalQuestionForm.reset();
          // Refresh questions after a short delay to allow AI to generate answer
          setTimeout(() => {
            this.getAllQuestions();
          }, 2000);
        }
        this.isSubmitting = false;
      },
      error: (err) => {
        console.log(err);
        this.isSubmitting = false;
        this.snackBar.open('প্রশ্ন জমা দেওয়ার সময় সমস্যা হয়েছে', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  /**
   * FILTER QUESTIONS
   * onFilterChange()
   */
  onFilterChange(filter: 'all' | 'pending' | 'answered') {
    this.selectedFilter = filter;
    this.getAllQuestions();
  }

  /**
   * GET FILTERED QUESTIONS
   * getFilteredQuestions()
   */
  getFilteredQuestions(): QnA[] {
    if (this.selectedTabIndex === 0) {
      // Course questions
      return this.questions.filter((q) => q.category === 'course');
    } else {
      // General questions
      return this.questions.filter((q) => q.category === 'general');
    }
  }

  /**
   * ON DESTROY
   */
  ngOnDestroy(): void {
    if (this.subGetData) {
      this.subGetData.unsubscribe();
    }
    if (this.subAddData) {
      this.subAddData.unsubscribe();
    }
    if (this.subGetCourses) {
      this.subGetCourses.unsubscribe();
    }
  }
}

