import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Course } from '../../interfaces/common/course.interface';
import { FilterData } from 'src/app/interfaces/core/filter-data.interface';
import {Observable, of, tap} from "rxjs";
import {Product} from "../../interfaces/common/product";

const API_URL = environment.apiBaseLink + '/api/course/';


@Injectable({
  providedIn: 'root'
})
export class CourseService {
  // Store Data For Cache
  private courseCache: Map<string, { data: Course[]; message: string; success: boolean }> = new Map();

  // Inject
  private readonly httpClient = inject(HttpClient);


  /**
   * getAllCourses()
   * getCourseById()
   * getCourseForPreviewByUser()
   * getCourseEnrollStatusByUser()
   */

  getAllCourses(filterData: FilterData, searchQuery?: string | any) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Course[], count: number, success: boolean }>(API_URL + 'get-all/', filterData, { params });
  }


  getAllCourse(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams()
      .set('page', filterData.pagination?.currentPage?.toString() || '1')
      .set('pageSize', filterData.pagination?.pageSize?.toString() || '10');

    if (searchQuery) {
      params = params.set('q', searchQuery);
    }
    if (filterData.filter) {
      params = params.set('filter', JSON.stringify(filterData.filter));
    }
    if (filterData.select) {
      params = params.set('select', JSON.stringify(filterData.select));
    }
    if (filterData.sort) {
      params = params.set('sort', JSON.stringify(filterData.sort));
    }

    return this.httpClient.get<{ data: Course[], count: number, success: boolean }>(
      API_URL + 'get-all-ui',
      { params }
    );
  }



  getCourseById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Course, message: string, success: boolean }>(API_URL + 'get-by-public/' + id, { params });
  }

  getCourseForPreviewByUser(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Course, message: string, success: boolean }>(API_URL + 'get-by-user-for-preview/' + id, { params });
  }

  getCourseEnrollStatusByUser(id: string) {
    return this.httpClient.get<{ data: { orderType: string }, message: string, success: boolean }>(API_URL + 'get-enroll-status-by-user/' + id);
  }


  getAllCoursesByUi(filter: any, page: number, limit: number): Observable<{
    data: Course[];
    subCategories: any[];
    message: string;
    success: boolean;
  }> {
    // Generate a unique cache key based on filterData
    const cacheKey = JSON.stringify({filter});

    // Check if data is already cached
    if (this.courseCache.has(cacheKey)) {
      return of(this.courseCache.get(cacheKey) as {
        data: Course[];
        subCategories: any[];
        message: string;
        success: boolean;
      });
    }

    let params = new HttpParams();
    if (filter) {
      // Dynamically add filters to query parameters
      Object.keys(filter).forEach(key => {
        if (filter[key] !== undefined && filter[key] !== null) {
          params = params.set(key, filter[key]);
        }
      });
    }

    if (page) {
      params = params.set('page', page);
    }

    if (limit) {
      params = params.set('limit', limit);
    }

    return this.httpClient
      .get<{
        data: Course[];
        subCategories: any[];
        message: string;
        success: boolean;
      }>(API_URL + 'get-all-data', {params})
      .pipe(
        tap((response) => {
          // Cache the response
          this.courseCache.set(cacheKey, response);
        })
      );
  }
  // getAllProductsByUi(filter: any, page: number, limit: number): Observable<{
  //   data: Product[];
  //   message: string;
  //   success: boolean;
  // }> {
  //   // Generate a unique cache key based on filterData
  //   const cacheKey = JSON.stringify({filter});
  //
  //   // Check if data is already cached
  //   if (this.productsCache.has(cacheKey)) {
  //     return of(this.productsCache.get(cacheKey) as {
  //       data: Product[];
  //       message: string;
  //       success: boolean;
  //     });
  //   }
  //
  //   let params = new HttpParams();
  //   if (filter) {
  //     // Dynamically add filters to query parameters
  //     Object.keys(filter).forEach(key => {
  //       if (filter[key] !== undefined && filter[key] !== null) {
  //         params = params.set(key, filter[key]);
  //       }
  //     });
  //   }
  //
  //   if (page) {
  //     params = params.set('page', page);
  //   }
  //
  //   if (limit) {
  //     params = params.set('limit', limit);
  //   }
  //
  //   return this.httpClient
  //     .get<{
  //       data: Product[];
  //       message: string;
  //       success: boolean;
  //     }>(API_PRODUCT + 'get-all-data', {params})
  //     .pipe(
  //       tap((response) => {
  //         // Cache the response
  //         this.productsCache.set(cacheKey, response);
  //       })
  //     );
  // }
}
