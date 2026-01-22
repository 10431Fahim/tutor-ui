import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {FilterData} from "../core/filter-data.interface";
import {ProductReview} from "./product-review.interface";

const API_REVIEW_CONTROL = environment.apiBaseLink + '/api/product-review/';


@Injectable({
  providedIn: 'root'
})
export class ProductReviewService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addReview
   * deleteReviewByReviewId
   * getAllReviewsByQuery
   */

  addReview(data: ProductReview) {
    return this.httpClient.post<{ message: string }>(API_REVIEW_CONTROL + 'add', data);
  }
  getReviewByUserId() {
    return this.httpClient.get<{ data: ProductReview[], success: boolean }>(API_REVIEW_CONTROL+ 'get-product-review-by-user');
  }

  deleteReviewByReviewId(id: string) {
    return this.httpClient.delete<{message?: string}>(API_REVIEW_CONTROL + 'delete-logged-in-user-product-review/' + id);
  }

  getAllReviewsByQuery(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: ProductReview[], count: number, success: boolean }>(API_REVIEW_CONTROL + 'get-all-product-review-by-query', filterData, {params});
  }


}
