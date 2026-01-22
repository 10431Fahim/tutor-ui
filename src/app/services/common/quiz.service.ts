import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Quiz } from 'src/app/interfaces/common/quiz.interface';
import {Observable} from 'rxjs';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {FilterData} from '../../interfaces/core/filter-data.interface';

const API_URL = environment.apiBaseLink + '/api/quiz/';


@Injectable({
  providedIn: 'root'
})
export class QuizService {

  // Inject
  private readonly httpClient = inject(HttpClient);

  /**
   * getQuizById()
   */

  getQuizById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Quiz, message: string, success: boolean }>(API_URL + 'get-by/' + id, { params });
  }

  addQuizResult(data: any): Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_URL + 'add-quiz-result', data);
  }

  checkQuizResult(data: any): Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_URL + 'check-quiz-result', data);
  }


  getAllQuizsResult(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Quiz[], count: number, success: boolean }>(API_URL + 'get-all-quiz-result/', filterData, {params});
  }

}
