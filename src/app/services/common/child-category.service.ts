import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ChildCategory } from '../../interfaces/common/child-category.interface';
import { FilterData } from '../../interfaces/core/filter-data.interface';
import { Observable, of, tap } from 'rxjs';

const API_URL = environment.apiBaseLink + '/api/childCategory/';

@Injectable({
  providedIn: 'root'
})
export class ChildCategoryService {
  // Store Data
  private readonly cacheKey: string = 'childcategory_cache';
  private carouselCache: Map<string, { data: ChildCategory[]; message: string; success: boolean }> = new Map();

  // Inject
  private readonly httpClient = inject(HttpClient);

  getAllChildCategorys(): Observable<{
    data: ChildCategory[];
    success: boolean;
    message: string;
  }> {
    if (this.carouselCache.has(this.cacheKey)) {
      return of(this.carouselCache.get(this.cacheKey) as {
        data: ChildCategory[];
        success: boolean;
        message: string;
      });
    }

    const filterData: FilterData = {
      filter: { status: 'publish' },
      sort: { priority: -1 },
      pagination: null,
      select: {
        name: 1,
        slug: 1,
        category: 1,
        subCategory: 1,
        status: 1
      }
    };

    return this.httpClient
      .post<{
        data: ChildCategory[];
        success: boolean;
        message: string;
      }>(API_URL + 'get-all', filterData)
      .pipe(
        tap((response) => {
          // Cache the response
          this.carouselCache.set(this.cacheKey, response);
        })
      );
  }
}






