import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { AssignmentSubmission } from '../../interfaces/common/assignment-submission.interface';
import { FilterData } from '../../interfaces/core/filter-data.interface';

const API_URL = environment.apiBaseLink + '/api/assignment-submission/';

@Injectable({
  providedIn: 'root',
})
export class AssignmentSubmissionService {
  private readonly httpClient = inject(HttpClient);

  /**
   * addAssignmentSubmission()
   * getAllAssignmentSubmissions()
   * getAssignmentSubmissionById()
   * gradeAssignmentSubmission()
   */
  addAssignmentSubmission(data: AssignmentSubmission) {
    return this.httpClient.post<ResponsePayload>(API_URL + 'add', data);
  }

  getAllAssignmentSubmissions(filterData?: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.get<{ data: { data: AssignmentSubmission[]; count: number }; success: boolean }>(
      API_URL + 'get-all',
      { params },
    );
  }

  getAssignmentSubmissionById(id: string) {
    return this.httpClient.get<{ data: AssignmentSubmission; success: boolean }>(
      API_URL + 'get/' + id,
    );
  }

  gradeAssignmentSubmission(id: string, data: { marksObtained: number; feedback?: string; gradedBy: string }) {
    return this.httpClient.put<ResponsePayload>(API_URL + 'grade/' + id, data);
  }
}



