import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { DashboardService } from '../../../services/common/dashboard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-general-dashboard',
  templateUrl: './general-dashboard.component.html',
  styleUrls: ['./general-dashboard.component.scss'],
})
export class GeneralDashboardComponent implements OnInit, OnDestroy {
  // Data
  dashboardData: any = null;
  loading = true;
  error: string | null = null;

  // Subscriptions
  private subGetDashboard: Subscription;

  // Inject
  private readonly dashboardService = inject(DashboardService);

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.error = null;
    this.subGetDashboard = this.dashboardService.getGeneralDashboard(10).subscribe({
      next: (res) => {
        if (res.success) {
          this.dashboardData = res.data;
        } else {
          this.error = res.message || 'Failed to load dashboard';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Dashboard error:', err);
        this.error = 'Failed to load dashboard data';
        this.loading = false;
      },
    });
  }

  ngOnDestroy(): void {
    if (this.subGetDashboard) {
      this.subGetDashboard.unsubscribe();
    }
  }
}
