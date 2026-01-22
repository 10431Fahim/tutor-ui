import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { Observable } from 'rxjs';

const API_URL = environment.apiBaseLink + '/api/leaderboard/';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  private readonly httpClient = inject(HttpClient);

  /**
   * Get all leaderboards
   */
  getLeaderboard(courseId?: string, quizId?: string): Observable<ResponsePayload> {
    let params = new HttpParams();
    if (courseId) {
      params = params.append('courseId', courseId);
    }
    if (quizId) {
      params = params.append('quizId', quizId);
    }
    return this.httpClient.get<ResponsePayload>(API_URL + 'get-all', { params });
  }

  /**
   * Get leaderboard by ID
   */
  getLeaderboardById(id: string): Observable<ResponsePayload> {
    return this.httpClient.get<ResponsePayload>(API_URL + 'get/' + id);
  }
}
