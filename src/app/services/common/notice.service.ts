import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FilterData } from '../../interfaces/core/filter-data.interface';
import { Notice } from '../../interfaces/common/notice.interface';

const API_URL = `${environment.apiBaseLink}/api/notice/`;


@Injectable({
  providedIn: 'root'
})
export class NoticeService {

  // Inject
  private readonly httpClient = inject(HttpClient);

  /**
   * getAllNotice()
   * getNoticeById()
   */

  getAllNotice(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{
      data: Notice[];
      count: number;
      success: boolean;
      calculation: any;
    }>(API_URL + 'get-all/', filterData, { params });
  }

  getNoticeById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{
      data: Notice;
      message: string;
      success: boolean;
    }>(API_URL + 'get-by/' + id, { params });
  }

}
