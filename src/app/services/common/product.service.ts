import {Injectable} from '@angular/core';
import {Product} from 'src/app/interfaces/common/product';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {UiService} from "../core/ui.service";
import {ReloadService} from "../core/reload.service";
import {FilterData} from "../../interfaces/core/filter-data.interface";
import {Observable, of, tap} from "rxjs";

const API_PRODUCT = `${environment.apiBaseLink}/api/product/`

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Store Data For Cache
  private productsCache: Map<string, { data: Product[]; message: string; success: boolean }> = new Map();
  constructor(
    private httpClient: HttpClient,
    private uiService: UiService,
    private reloadService: ReloadService,

  ) { }



  /**
   * PRODUCT HTTP REQUEST
   * getAllProducts()
   * getProductById()
  */
  getAllProducts(filter: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }

    return this.httpClient.post<{ data: Product[], success: string, count: number }>(`${API_PRODUCT}get-all/`, filter, { params });

  }

  // getAllProducts(filterData: FilterData, searchQuery?: string) {
  //   let params = new HttpParams();
  //   if (searchQuery) {
  //     params = params.append('q', searchQuery);
  //   }
  //   return this.httpClient.post<{ data: Product[], count: number, success: boolean }>(API_PRODUCT + 'get-all', filterData, {params});
  // }

  getProductById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Product, message: string, success: boolean }>(API_PRODUCT + id, { params });
  }

  getProductByIds(ids: string[], select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.post<{ data: Product[], count: number, success: boolean }>(API_PRODUCT + 'get-products-by-ids', {ids}, {params});
  }



  /**
   * COMPARE LIST with LOCAL STORAGE
   */

  addToCompare(productId: string, categoryId?: string) {
    // console.log(product);
    const items = JSON.parse(localStorage.getItem('compareListV2'));
    let compareListV2;
    if (items === null) {
      compareListV2 = [];
      compareListV2.push({_id: productId, category: categoryId});
      this.uiService.success('Product added to compare list');
      this.reloadService.needRefreshCompareList$();
    } else {
      compareListV2 = items;
      const fIndex = compareListV2.findIndex((o) => o._id === productId);
      const fIndexCat = compareListV2.findIndex((o) => o.category === categoryId);
      if (fIndex === -1) {
        if (compareListV2.length !== 3) {
          if (fIndexCat === -1) {
            this.uiService.wrong('Please add same category product to compare');
          } else {
            compareListV2.push({_id: productId, category: categoryId});
            this.uiService.success('Product added to compare list');
            this.reloadService.needRefreshCompareList$();
          }

        }
        else {
          this.uiService.wrong('Your compare list is full');
        }
      } else {
        this.uiService.warn('This product already in compare list');
      }
    }
    localStorage.setItem('compareListV2', JSON.stringify(compareListV2));
  }


  getCompareList(): string[] {
    const list = localStorage.getItem('compareListV2');
    if (list === null) {
      return [];
    }
    return JSON.parse(list) as any[];
  }

  deleteCompareItem(id: string) {
    const items = JSON.parse(localStorage.getItem('compareListV2'));
    const filtered = items.filter(el => el._id !== id);
    if (filtered && filtered.length){
      localStorage.setItem('compareListV2', JSON.stringify(filtered));
    } else {
      localStorage.removeItem('compareListV2');
    }
  }
  getAllProductsByUi(filter: any, page: number, limit: number): Observable<{
    data: Product[];
    message: string;
    success: boolean;
  }> {
    // Generate a unique cache key based on filterData
    const cacheKey = JSON.stringify({filter});

    // Check if data is already cached
    if (this.productsCache.has(cacheKey)) {
      return of(this.productsCache.get(cacheKey) as {
        data: Product[];
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
        data: Product[];
        message: string;
        success: boolean;
      }>(API_PRODUCT + 'get-all-data', {params})
      .pipe(
        tap((response) => {
          // Cache the response
          this.productsCache.set(cacheKey, response);
        })
      );
  }
}
