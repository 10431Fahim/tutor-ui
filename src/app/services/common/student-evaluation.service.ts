import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { StudentEvaluation } from '../../interfaces/common/student-evaluation.interface';
import { FilterData } from '../../interfaces/core/filter-data.interface';

const API_URL = environment.apiBaseLink + '/api/student-evaluation/';

@Injectable({
  providedIn: 'root',
})
export class StudentEvaluationService {
  private readonly httpClient = inject(HttpClient);

  /**
   * addStudentEvaluation()
   * getAllStudentEvaluations()
   * getStudentEvaluationById()
   * updateStudentEvaluationById()
   * deleteStudentEvaluationById()
   */
  addStudentEvaluation(data: StudentEvaluation) {
    return this.httpClient.post<ResponsePayload>(API_URL + 'add', data);
  }

  getAllStudentEvaluations(filterData?: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.get<{ data: { data: StudentEvaluation[]; count: number }; success: boolean }>(
      API_URL + 'get-all',
      { params },
    );
  }

  getStudentEvaluationById(id: string) {
    return this.httpClient.get<{ data: StudentEvaluation; success: boolean }>(
      API_URL + 'get/' + id,
    );
  }

  updateStudentEvaluationById(id: string, data: Partial<StudentEvaluation>) {
    return this.httpClient.put<ResponsePayload>(API_URL + 'update/' + id, data);
  }

  deleteStudentEvaluationById(id: string) {
    return this.httpClient.delete<ResponsePayload>(API_URL + 'delete/' + id);
  }
}



