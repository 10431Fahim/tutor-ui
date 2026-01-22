import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { FilterData } from 'src/app/interfaces/core/filter-data.interface';
import { ResponsePayload } from 'src/app/interfaces/core/response-payload.interface';
import { QnA } from 'src/app/interfaces/common/qna.interface';

const API_URL = environment.apiBaseLink + '/api/qna/';

@Injectable({
  providedIn: 'root',
})
export class QnaService {
  // Inject
  private readonly httpClient = inject(HttpClient);

  /**
   * addQna()
   * getAllQna()
   * getQnaById()
   * updateQnaById()
   */
  addQna(data: QnA) {
    return this.httpClient.post<ResponsePayload>(API_URL + 'add', data);
  }

  getAllQna(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: QnA[]; count: number; success: boolean }>(
      API_URL + 'get-all',
      filterData,
      { params },
    );
  }

  getQnaById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: QnA; success: boolean }>(
      API_URL + 'get-by/' + id,
      { params },
    );
  }

  updateQnaById(id: string, data: Partial<QnA>) {
    return this.httpClient.put<ResponsePayload>(API_URL + 'update/' + id, data);
  }
}

