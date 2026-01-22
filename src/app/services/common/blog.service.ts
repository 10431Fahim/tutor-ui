import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FilterData } from '../../interfaces/core/filter-data.interface';
import { Blog } from '../../interfaces/common/blog.interface';

const API_URL = `${environment.apiBaseLink}/api/blog/`;


@Injectable({
  providedIn: 'root'
})
export class BlogService {

  // Inject
  private readonly httpClient = inject(HttpClient);

  /**
   * getAllBlog()
   * getBlogById()
   */

  getAllBlog(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{
      data: Blog[];
      count: number;
      success: boolean;
      calculation: any;
    }>(API_URL + 'get-all/', filterData, { params });
  }

  getBlogById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{
      data: Blog;
      message: string;
      success: boolean;
    }>(API_URL + 'get-by/' + id, { params });
  }

}
