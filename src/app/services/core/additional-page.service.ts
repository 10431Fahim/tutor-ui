import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AdditionalPage } from '../../interfaces/core/additional-page.interface';

const API_URL = environment.apiBaseLink + '/api/additional-page/';


@Injectable({
  providedIn: 'root'
})
export class AdditionalPageService {

  // Inject
  private readonly httpClient = inject(HttpClient);

  /**
   * getAdditionalPageBySlug()
   */
  getAdditionalPageBySlug(slug: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: AdditionalPage, message: string, success: boolean }>(API_URL + 'get-by-slug/' + slug, { params });
  }
}
