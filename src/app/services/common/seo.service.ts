import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Seo } from '../../interfaces/common/seo.interface';
import { FilterData } from '../../interfaces/core/filter-data.interface';

const API_URL = environment.apiBaseLink + '/api/seo/';


@Injectable({
  providedIn: 'root'
})
export class SeoService {

  // Inject
  private readonly httpClient = inject(HttpClient);

  /**
   * getAllSeos()
   * getSeoById()
   * getSeoByPageName()
   */

  getAllSeos(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    return this.httpClient.post<{ data: Seo[], count: number, success: boolean }>(API_URL + 'get-all', filterData, { params });
  }

  getSeoById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Seo, message: string, success: boolean }>(API_URL + id, { params });
  }

  getSeoByPageName(pageName: string) {
    let params = new HttpParams();
    if (pageName) {
      params = params.append('page', pageName);
    }
    return this.httpClient.get<{ data: Seo, message: string, success: boolean }>(API_URL + 'get-seo-by-page-name', { params });
  }

}
