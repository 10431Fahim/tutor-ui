import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { Observable } from 'rxjs';

const API_URL = environment.apiBaseLink + '/api/omr/';

@Injectable({
  providedIn: 'root',
})
export class OmrService {
  private readonly httpClient = inject(HttpClient);

  /**
   * Issue OMR sheet for an exam
   */
  issueOmr(examId: string, courseId?: string): Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_URL + 'issue', {
      examId,
      courseId,
    });
  }

  /**
   * Upload OMR scan file
   */
  scanOmr(examId: string, file: File, courseId?: string): Observable<ResponsePayload> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('examId', examId);
    if (courseId) {
      formData.append('courseId', courseId);
    }
    return this.httpClient.post<ResponsePayload>(API_URL + 'scan', formData);
  }

  /**
   * Get OMR scan job status
   */
  getScanJobStatus(jobId: string): Observable<ResponsePayload> {
    return this.httpClient.get<ResponsePayload>(API_URL + `scan/${jobId}/status`);
  }
}
