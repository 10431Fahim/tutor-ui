import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { Assignment } from '../../interfaces/common/assignment.interface';
import { FilterData } from '../../interfaces/core/filter-data.interface';

const API_URL = environment.apiBaseLink + '/api/assignment/';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  private readonly httpClient = inject(HttpClient);

  /**
   * addAssignment()
   * getAllAssignments()
   * getAssignmentById()
   * updateAssignmentById()
   * deleteAssignmentById()
   */
  addAssignment(data: Assignment) {
    return this.httpClient.post<ResponsePayload>(API_URL + 'add', data);
  }

  getAllAssignments(filterData?: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.get<{ data: { data: Assignment[]; count: number }; success: boolean }>(
      API_URL + 'get-all',
      { params },
    );
  }

  getAssignmentById(id: string) {
    return this.httpClient.get<{ data: Assignment; success: boolean }>(
      API_URL + 'get/' + id,
    );
  }

  updateAssignmentById(id: string, data: Partial<Assignment>) {
    return this.httpClient.put<ResponsePayload>(API_URL + 'update/' + id, data);
  }

  deleteAssignmentById(id: string) {
    return this.httpClient.delete<ResponsePayload>(API_URL + 'delete/' + id);
  }
}



