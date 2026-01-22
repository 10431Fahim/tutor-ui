import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FilterData } from '../../interfaces/core/filter-data.interface';
import { ShopInformation } from 'src/app/interfaces/common/shop-information.interface';

const API_URL = environment.apiBaseLink + '/api/shop-information/';


@Injectable({
  providedIn: 'root'
})
export class ShopInformationService {

  // Inject
  private readonly httpClient = inject(HttpClient);

  /**
   * getShopInformation()
   * getAllShopInformations()
   */

  getShopInformation(select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: ShopInformation, message: string, success: boolean }>(API_URL + 'get', { params });
  }

  getAllShopInformations(filterData: FilterData, searchQuery?: string | any) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: ShopInformation[], count: number, success: boolean }>(API_URL + 'get-all', filterData, { params });
  }

}
