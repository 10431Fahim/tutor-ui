import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FilterData } from '../../interfaces/core/filter-data.interface';
import { ExamCourse } from '../../interfaces/common/exam-course.interface';

const API_URL = environment.apiBaseLink + '/api/exam-course/';

@Injectable({
  providedIn: 'root'
})
export class ExamCourseService {
  private readonly httpClient = inject(HttpClient);

  /**
   * getAllExamCourses()
   * getAllActiveExamCourses()
   * getExamCourseById()
   */

  getAllExamCourses(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: ExamCourse[], count: number, success: boolean }>(
      API_URL + 'get-all',
      filterData,
      { params }
    );
  }

  getAllActiveExamCourses() {
    return this.httpClient.get<{ data: ExamCourse[], success: boolean, message: string }>(
      API_URL + 'get-all-active'
    );
  }

  getExamCourseById(id: string) {
    return this.httpClient.get<{ data: ExamCourse, success: boolean, message: string }>(
      API_URL + id
    );
  }
}
