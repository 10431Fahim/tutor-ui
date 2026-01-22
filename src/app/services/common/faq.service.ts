import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from "rxjs";
import { FilterData } from 'src/app/interfaces/core/filter-data.interface';
import { Faq } from 'src/app/interfaces/common/faq.interface';

const API_URL = environment.apiBaseLink + '/api/faq/';


@Injectable({
  providedIn: 'root'
})
export class FaqService {

  private faqResponse: any;

  // Inject
  private readonly httpClient = inject(HttpClient);

  /**
   * getAllFaqs()
   * getAllFaqsWithCache()
   */

  getAllFaqs(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Faq[], count: number, success: boolean }>(API_URL + 'get-all/', filterData, { params });
  }

  getAllFaqsWithCache(filterData: FilterData, searchQuery?: string, refresh?: boolean) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }

    return new Observable<{ data: Faq[]; count: number; success: boolean }>((observer) => {
      if (this.faqResponse && !refresh) {
        observer.next(this.faqResponse);
        observer.complete()
      } else {
        this.httpClient.post<{ data: Faq[], count: number, success: boolean }>(API_URL + 'get-all/', filterData, { params })
          .subscribe({
            next: res => {
              this.faqResponse = res;
              observer.next(res);
              observer.complete();
            },
            error: err => {
              console.log(err);
            }
          })
      }
    });
  }

}
