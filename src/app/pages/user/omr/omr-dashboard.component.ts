import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { OmrService } from '../../../services/common/omr.service';
import { DashboardService } from '../../../services/common/dashboard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-omr-dashboard',
  templateUrl: './omr-dashboard.component.html',
  styleUrls: ['./omr-dashboard.component.scss'],
})
export class OmrDashboardComponent implements OnInit, OnDestroy {
  // Data
  exams: any[] = [];
  loading = true;
  error: string | null = null;

  // Subscriptions
  private subGetDashboard: Subscription;

  // Inject
  private readonly dashboardService = inject(DashboardService);
  private readonly omrService = inject(OmrService);

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams(): void {
    this.loading = true;
    this.error = null;
    // Get exams from dashboard or quiz service
    this.subGetDashboard = this.dashboardService.getGeneralDashboard(50).subscribe({
      next: (res) => {
        if (res.success && res.data?.freeExams) {
          // Filter OMR-enabled exams (you may need to add a flag in your exam model)
          this.exams = res.data.freeExams.filter((exam: any) => exam.examMode === 'live-mcq' || exam.examMode === 'omr');
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('OMR Dashboard error:', err);
        this.error = 'Failed to load exams';
        this.loading = false;
      },
    });
  }

  issueOmrCode(examId: string, courseId?: string): void {
    this.omrService.issueOmr(examId, courseId).subscribe({
      next: (res) => {
        if (res.success) {
          alert(`OMR Code: ${res.data.omrCode}`);
          this.loadExams(); // Reload to update status
        }
      },
      error: (err) => {
        alert('Failed to issue OMR code: ' + (err.error?.message || err.message));
      },
    });
  }

  ngOnDestroy(): void {
    if (this.subGetDashboard) {
      this.subGetDashboard.unsubscribe();
    }
  }
}
