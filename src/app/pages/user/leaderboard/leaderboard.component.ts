import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { LeaderboardService } from '../../../services/common/leaderboard.service';
import { Leaderboard } from '../../../interfaces/common/leaderboard.interface';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit, OnDestroy {
  // Store Data
  leaderboards: Leaderboard[] = [];
  selectedLeaderboard: Leaderboard | null = null;
  displayedColumns: string[] = ['rank', 'name', 'marks', 'percentage'];
  
  // Loader
  isLoading = false;
  
  // Subscriptions
  private subGetData: Subscription;
  
  // Inject
  private readonly leaderboardService = inject(LeaderboardService);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.loadLeaderboards();
  }

  loadLeaderboards(): void {
    this.isLoading = true;
    const courseId = this.route.snapshot.queryParamMap.get('courseId');
    const quizId = this.route.snapshot.queryParamMap.get('quizId');
    
    this.subGetData = this.leaderboardService.getLeaderboard(courseId || undefined, quizId || undefined).subscribe({
      next: (res) => {
        if (res.success) {
          this.leaderboards = Array.isArray(res.data) ? res.data : [res.data];
          if (this.leaderboards.length > 0) {
            this.selectedLeaderboard = this.leaderboards[0];
          }
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading leaderboard:', err);
        this.isLoading = false;
      }
    });
  }

  selectLeaderboard(leaderboard: Leaderboard): void {
    this.selectedLeaderboard = leaderboard;
  }

  ngOnDestroy(): void {
    if (this.subGetData) {
      this.subGetData.unsubscribe();
    }
  }
}
