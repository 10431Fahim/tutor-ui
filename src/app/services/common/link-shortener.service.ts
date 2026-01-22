import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {LinkShortener} from '../../interfaces/common/link-shortener.interface';

const API_BRAND = environment.apiBaseLink + '/api/link-shortener/';


@Injectable({
  providedIn: 'root'
})
export class LinkShortenerService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * getLinkShortenerBySlug()
   */
  getLinkShortenerBySlug(slug: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{
      data: LinkShortener,
      message: string,
      success: boolean
    }>(API_BRAND + 'get-by-slug/' + slug, {params});
  }

}
