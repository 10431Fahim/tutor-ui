import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupportService, SupportTicket } from '../../../services/common/support.service';
import { UserDataService } from '../../../services/common/user-data.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-support-center',
  templateUrl: './support-center.component.html',
  styleUrls: ['./support-center.component.scss'],
})
export class SupportCenterComponent implements OnInit, OnDestroy {
  // Forms
  ticketForm: FormGroup;
  aiAnswer: string | null = null;
  aiLoading = false;

  // Data
  tickets: SupportTicket[] = [];
  loading = true;
  user: any = null;

  // Subscriptions
  private subGetTickets: Subscription;
  private subGetUser: Subscription;

  // Inject
  private readonly fb = inject(FormBuilder);
  private readonly supportService = inject(SupportService);
  private readonly userDataService = inject(UserDataService);
  private readonly snackBar = inject(MatSnackBar);

  constructor() {
    this.ticketForm = this.fb.group({
      phone: ['', [Validators.required]],
      category: ['other', [Validators.required]],
      courseId: [''],
      examId: [''],
      message: ['', [Validators.required, Validators.minLength(10)]],
      preferredChannel: ['human'],
    });
  }

  ngOnInit(): void {
    this.loadUserData();
    this.loadTickets();
  }

  loadUserData(): void {
    this.subGetUser = this.userDataService.getLoggedInUserData().subscribe({
      next: (res) => {
        if (res.data) {
          this.user = res.data;
          this.ticketForm.patchValue({
            phone: this.user.phone || this.user.email || '',
          });
        }
      },
    });
  }

  loadTickets(): void {
    this.loading = true;
    this.subGetTickets = this.supportService.getMyTickets().subscribe({
      next: (res) => {
        if (res.success) {
          this.tickets = res.data || [];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Load tickets error:', err);
        this.loading = false;
      },
    });
  }

  askAi(): void {
    if (!this.ticketForm.get('message')?.value) {
      this.snackBar.open('Please enter your question first', 'Close', { duration: 3000 });
      return;
    }

    this.aiLoading = true;
    this.aiAnswer = null;

    const request = {
      question: this.ticketForm.get('message')?.value,
      context: {
        courseId: this.ticketForm.get('courseId')?.value || undefined,
        examId: this.ticketForm.get('examId')?.value || undefined,
        category: this.ticketForm.get('category')?.value,
      },
    };

    this.supportService.askAi(request).subscribe({
      next: (res) => {
        if (res.success) {
          this.aiAnswer = res.data?.answer || res.data?.message || 'AI response received';
        } else {
          this.snackBar.open(res.message || 'Failed to get AI response', 'Close', { duration: 5000 });
        }
        this.aiLoading = false;
      },
      error: (err) => {
        this.snackBar.open('AI service error: ' + (err.error?.message || err.message), 'Close', {
          duration: 5000,
        });
        this.aiLoading = false;
      },
    });
  }

  submitTicket(): void {
    if (this.ticketForm.invalid) {
      this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
      return;
    }

    const formValue = this.ticketForm.value;
    const ticket: Partial<SupportTicket> = {
      phone: formValue.phone,
      category: formValue.category,
      courseId: formValue.courseId || undefined,
      examId: formValue.examId || undefined,
      message: formValue.message,
      preferredChannel: formValue.preferredChannel,
    };

    this.supportService.createTicket(ticket).subscribe({
      next: (res) => {
        if (res.success) {
          this.snackBar.open('Ticket created successfully', 'Close', { duration: 3000 });
          this.ticketForm.reset({
            phone: this.user?.phone || this.user?.email || '',
            category: 'other',
            preferredChannel: 'human',
          });
          this.aiAnswer = null;
          this.loadTickets();
        } else {
          this.snackBar.open(res.message || 'Failed to create ticket', 'Close', { duration: 5000 });
        }
      },
      error: (err) => {
        this.snackBar.open('Error: ' + (err.error?.message || err.message), 'Close', { duration: 5000 });
      },
    });
  }

  getStatusColor(status?: string): string {
    switch (status) {
      case 'resolved':
        return 'green';
      case 'in_progress':
        return 'blue';
      case 'closed':
        return 'gray';
      default:
        return 'orange';
    }
  }

  ngOnDestroy(): void {
    if (this.subGetTickets) {
      this.subGetTickets.unsubscribe();
    }
    if (this.subGetUser) {
      this.subGetUser.unsubscribe();
    }
  }
}
