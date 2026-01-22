import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FilterData } from '../../interfaces/core/filter-data.interface';
import { ExamSchedule } from '../../interfaces/common/exam-schedule.interface';

const API_URL = environment.apiBaseLink + '/api/exam-schedule/';

@Injectable({
  providedIn: 'root'
})
export class ExamScheduleService {
  private readonly httpClient = inject(HttpClient);

  /**
   * getAllExamSchedules()
   * getExamSchedulesByType()
   * getExamScheduleById()
   */

  getAllExamSchedules(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: ExamSchedule[], count: number, success: boolean }>(
      API_URL + 'get-all',
      filterData,
      { params }
    );
  }

  getExamSchedulesByType(examType: 'mcq' | 'written') {
    return this.httpClient.get<{ data: ExamSchedule[], success: boolean, message: string }>(
      API_URL + 'get-by-type',
      { params: new HttpParams().set('examType', examType) }
    );
  }

  getExamScheduleById(id: string) {
    return this.httpClient.get<{ data: ExamSchedule, success: boolean, message: string }>(
      API_URL + id
    );
  }
}
