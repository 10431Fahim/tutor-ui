import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FilterData } from '../../interfaces/core/filter-data.interface';
import { Order } from '../../interfaces/common/order.interface';
import { ResponsePayload } from 'src/app/interfaces/core/response-payload.interface';
import { Observable } from 'rxjs/internal/Observable';

const API_URL = `${environment.apiBaseLink}/api/order/`;

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  // Inject
  private readonly httpClient = inject(HttpClient);

  /**
  * addOrderByUser()
  * getAllOrdersByUser()
  * getOrderById()
  * updateOrderById()
  * updateOrderByUserId()
  * deleteOrderById()
  * deleteMultipleOrderById()
  */

  addOrderByUser(data: Order): Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_URL + 'add-by-user', data);
  }

  getAllOrdersByUser(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Order[], count: number, success: boolean }>(API_URL + 'get-all-by-user/', filterData, { params });
  }

  getOrderById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Order, message: string, success: boolean }>(API_URL + 'get-by/' + id, { params });
  }

  updateOrderByUserId(id: string, data: any) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_URL + 'update-by-user/' + id, data);
  }

  updateFreeCourseByUser(id: string, data: any) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_URL + 'update-free-course-by-user/' + id, data);
  }
}
