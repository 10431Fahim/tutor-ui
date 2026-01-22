import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SubCategory } from '../../interfaces/common/sub-category.interface';
import { FilterData } from 'src/app/interfaces/core/filter-data.interface';
import {Category} from "../../interfaces/common/category.interface";
import {Observable, of, tap} from "rxjs";

const API_URL = environment.apiBaseLink + '/api/subCategory/';


@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {

  // Store Data
  private readonly cacheKey: string = 'subcategory_cache';
  private carouselCache: Map<string, { data: SubCategory[]; message: string; success: boolean }> = new Map();

  // Store Data
  private readonly subCacheKey: string = 'subcategorydata_cache';
  private subCategoryDataCache: Map<string, { data: SubCategory[]; message: string; success: boolean }> = new Map();

  // Inject
  private readonly httpClient = inject(HttpClient);

  /**
   * getAllSubCategory()
   * getSubCategoriesByCategorySlug()
   */

  /**
   * getAllCategorys
   */

  getAllSubCategorys(): Observable<{
    data: SubCategory[];
    success: boolean;
    message: string;
  }> {
    if (this.carouselCache.has(this.cacheKey)) {
      return of(this.carouselCache.get(this.cacheKey) as {
        data: SubCategory[];
        success: boolean;
        message: string;
      });
    }

    return this.httpClient
      .get<{
        data: SubCategory[];
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


  getAllSubCategorysData(): Observable<{
    data: SubCategory[];
    success: boolean;
    message: string;
  }> {
    if (this.subCategoryDataCache.has(this.subCacheKey)) {
      return of(this.subCategoryDataCache.get(this.subCacheKey) as {
        data: SubCategory[];
        success: boolean;
        message: string;
      });
    }

    return this.httpClient
      .get<{
        data: SubCategory[];
        success: boolean;
        message: string;
      }>(API_URL + 'get-all-sub-data')
      .pipe(
        tap((response) => {
          // Cache the response
          this.subCategoryDataCache.set(this.subCacheKey, response);
        })
      );
  }

  getAllSubCategory(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: SubCategory[], count: number, success: boolean }>(API_URL + 'get-all/', filterData, { params });
  }

  getSubCategoriesByCategorySlug(categorySlug: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: SubCategory[], message: string, success: boolean }>(API_URL + 'get-all-by-parent-by-slug/' + categorySlug, { params });
  }

}
