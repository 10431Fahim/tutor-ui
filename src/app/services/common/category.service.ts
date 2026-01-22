import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FilterData } from '../../interfaces/core/filter-data.interface';
import {Observable, of, tap} from 'rxjs';
import {Category} from '../../interfaces/common/category.interface';
import {SubCategory} from "../../interfaces/common/sub-category.interface";
const API_URL = environment.apiBaseLink + '/api/category/';

const API_CATEGORY = environment.apiBaseLink + '/api/productCategory/';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  // Store Data
  private readonly cacheKey: string = 'category_cache';
  private carouselCache: Map<string, { data: Category[]; message: string; success: boolean }> = new Map();

  private categoryResponse: any;

  // Inject
  private readonly httpClient = inject(HttpClient);

  /**
   * getAllCategories()
   * getAllCategoriesWithCache()
   */

  getAllCategories(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Category[], count: number, success: boolean }>(API_URL + 'get-all', filterData, { params });
  }

  getAllCategoriesWithCache(filterData: FilterData, searchQuery?: string, refresh?: boolean) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    filterData.select = {
      name: 1,
      description: 1,
      slug: 1,
      image: 1,
      priority: 1
    }

    return new Observable<{ data: Category[]; count: number; success: boolean }>((observer) => {
      if (this.categoryResponse && !refresh) {
        observer.next(this.categoryResponse);
        observer.complete()
      } else {
        this.httpClient.post<{ data: Category[], count: number, success: boolean }>(API_URL + 'get-all/', filterData, { params })
          .subscribe({
            next: res => {
              this.categoryResponse = res;
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

  getAllCategory(filterData?: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }

    return this.httpClient.post<{ data: Category[], count: number, success: boolean }>(API_CATEGORY + 'get-all/', filterData, { params });
  }

  // getSubCategoriesByCategoryId(categoryId: string, select?: string) {
  //   let params = new HttpParams();
  //   if (select) {
  //     params = params.append('select', select);
  //   }
  //   return this.httpClient.get<{ data: SubCategory[], message: string, success: boolean }>(API_SUB_CATEGORY + 'get-all-by-parent/' + categoryId, {params});
  // }

  /**
   * getAllCategorys
   */

  getAllCategorys(): Observable<{
    data: Category[];
    success: boolean;
    message: string;
  }> {
    if (this.carouselCache.has(this.cacheKey)) {
      return of(this.carouselCache.get(this.cacheKey) as {
        data: Category[];
        success: boolean;
        message: string;
      });
    }

    return this.httpClient
      .get<{
        data: Category[];
        success: boolean;
        message: string;
      }>(API_URL + 'get-all-data')
      .pipe(
        tap((response) => {
          // Cache the response
          this.carouselCache.set(this.cacheKey, response);
        })
      );
  }
}
