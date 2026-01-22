import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { Observable } from 'rxjs';

const API_URL = environment.apiBaseLink + '/api/dashboard/';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly httpClient = inject(HttpClient);

  /**
   * Get General Dashboard data
   */
  getGeneralDashboard(limit?: number): Observable<ResponsePayload> {
    let params = new HttpParams();
    if (limit) {
      params = params.set('limit', limit.toString());
    }
    return this.httpClient.get<ResponsePayload>(API_URL + 'general', { params });
  }

  /**
   * Get Course Dashboard data
   */
  getCourseDashboard(courseId: string): Observable<ResponsePayload> {
    return this.httpClient.get<ResponsePayload>(
      `${environment.apiBaseLink}/api/courses/${courseId}/dashboard`
    );
  }
}
