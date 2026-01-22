import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AssignmentService } from '../../../services/common/assignment.service';
import { AssignmentSubmissionService } from '../../../services/common/assignment-submission.service';
import { OrderService } from '../../../services/common/order.service';
import { UserDataService } from '../../../services/common/user-data.service';
import { UiService } from '../../../services/core/ui.service';
import { FileUploadService } from '../../../services/gallery/file-upload.service';
import { Assignment } from '../../../interfaces/common/assignment.interface';
import { AssignmentSubmission } from '../../../interfaces/common/assignment-submission.interface';
import { Order } from '../../../interfaces/common/order.interface';
import { User } from '../../../interfaces/common/user.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.scss'],
})
export class AssignmentComponent implements OnInit, OnDestroy {
  // Store Data
  assignments: Assignment[] = [];
  enrolledCourses: Order[] = [];
  user: User | any = null;
  selectedCourseId: string = '';
  selectedAssignment: Assignment | null = null;
  submission: AssignmentSubmission | null = null;
  submissionForm: any = {
    submissionText: '',
    submittedFiles: [],
  };
  selectedFiles: File[] = [];

  // Loader
  isLoading = false;
  isSubmitting = false;

  // Subscriptions
  private subGetAssignments: Subscription;
  private subGetCourses: Subscription;
  private subGetUser: Subscription;
  private subGetSubmission: Subscription;
  private subSubmit: Subscription;

  // Inject
  private readonly assignmentService = inject(AssignmentService);
  private readonly assignmentSubmissionService = inject(AssignmentSubmissionService);
  private readonly orderService = inject(OrderService);
  private readonly userDataService = inject(UserDataService);
  private readonly uiService = inject(UiService);
  private readonly fileUploadService = inject(FileUploadService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  ngOnInit() {
    this.getUserData();
    this.getAllEnrolledCourses();
    this.route.queryParams.subscribe((params) => {
      if (params['courseId']) {
        this.selectedCourseId = params['courseId'];
        this.getAssignmentsByCourse();
      }
    });
  }

  ngOnDestroy() {
    if (this.subGetAssignments) {
      this.subGetAssignments.unsubscribe();
    }
    if (this.subGetCourses) {
      this.subGetCourses.unsubscribe();
    }
    if (this.subGetUser) {
      this.subGetUser.unsubscribe();
    }
    if (this.subGetSubmission) {
      this.subGetSubmission.unsubscribe();
    }
    if (this.subSubmit) {
      this.subSubmit.unsubscribe();
    }
  }

  /**
   * HTTP REQ HANDLE
   */
  private getUserData() {
    this.subGetUser = this.userDataService.getLoggedInUserData().subscribe({
      next: (res) => {
        this.user = res.data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  private getAllEnrolledCourses() {
    this.isLoading = true;
    const filterData = {
      filter: { orderStatus: 'Delivered' },
      pagination: null,
      sort: { createdAt: -1 },
    };
    this.subGetCourses = this.orderService.getAllOrdersByUser(filterData).subscribe({
      next: (res) => {
        this.enrolledCourses = res.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  getAssignmentsByCourse() {
    if (!this.selectedCourseId) {
      return;
    }
    this.isLoading = true;
    this.subGetAssignments = this.assignmentService
      .getAllAssignments({ courseId: this.selectedCourseId } as any)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.assignments = res.data.data || [];
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
  }

  onCourseSelect(courseId: string) {
    this.selectedCourseId = courseId;
    this.getAssignmentsByCourse();
  }

  viewAssignment(assignment: Assignment) {
    this.selectedAssignment = assignment;
    if (this.user?._id) {
      this.getSubmission(assignment._id);
    }
  }

  getSubmission(assignmentId: string) {
    this.subGetSubmission = this.assignmentSubmissionService
      .getAllAssignmentSubmissions({ assignmentId, studentId: this.user._id } as any)
      .subscribe({
        next: (res) => {
          if (res.success && res.data.data && res.data.data.length > 0) {
            this.submission = res.data.data[0];
          } else {
            this.submission = null;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  onFileSelect(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  submitAssignment() {
    if (!this.selectedAssignment || !this.user?._id) {
      return;
    }

    this.isSubmitting = true;

    // Upload files first if any
    if (this.selectedFiles.length > 0) {
      this.fileUploadService.uploadMultiImageOriginal(this.selectedFiles).subscribe({
        next: (uploadRes) => {
          if (uploadRes && Array.isArray(uploadRes)) {
            const fileUrls = uploadRes.map((file: any) => file.url || file);
            this.submitAssignmentData(fileUrls);
          } else {
            this.uiService.warn('Failed to upload files');
            this.isSubmitting = false;
          }
        },
        error: (err) => {
          console.log(err);
          this.uiService.warn('Failed to upload files');
          this.isSubmitting = false;
        },
      });
    } else {
      this.submitAssignmentData([]);
    }
  }

  private submitAssignmentData(fileUrls: string[]) {
    const data: AssignmentSubmission = {
      assignmentId: this.selectedAssignment._id,
      studentId: this.user._id,
      courseId: this.selectedAssignment.courseId,
      submittedFiles: fileUrls,
      submissionText: this.submissionForm.submissionText,
    };

    this.subSubmit = this.assignmentSubmissionService.addAssignmentSubmission(data).subscribe({
      next: (res) => {
        if (res.success) {
          this.uiService.success('Assignment submitted successfully');
          this.getSubmission(this.selectedAssignment._id);
          this.submissionForm = { submissionText: '', submittedFiles: [] };
          this.selectedFiles = [];
        }
        this.isSubmitting = false;
      },
      error: (err) => {
        console.log(err);
        this.uiService.warn('Failed to submit assignment');
        this.isSubmitting = false;
      },
    });
  }

  closeDetails() {
    this.selectedAssignment = null;
    this.submission = null;
  }
}

