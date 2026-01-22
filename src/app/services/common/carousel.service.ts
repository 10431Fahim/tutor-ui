import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Carousel } from '../../interfaces/common/carousel.interface';
import { FilterData } from '../../interfaces/core/filter-data.interface';
import {Observable, of, tap} from 'rxjs';
import SwiperCore, { Autoplay, EffectCoverflow, EffectFade, Navigation, Pagination } from 'swiper';
import {Category} from "../../interfaces/common/category.interface";

// Swiper
SwiperCore.use([EffectCoverflow, EffectFade, Autoplay, Pagination, Navigation]);

const API_URL = environment.apiBaseLink + '/api/carousel/';


@Injectable({
  providedIn: 'root'
})
export class CarouselService {
  private readonly cacheKey: string = 'carousel_cache';
  private carouselCache: Map<string, { data: Carousel[]; message: string; success: boolean }> = new Map();

  private carouselResponse: any;

  // Inject
  private readonly httpClient = inject(HttpClient);

  /**
   * getAllCarousels()
   * getAllCarouselsWithCache()
   */

  getAllCarousels(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{
      data: Carousel[],
      count: number,
      success: boolean
    }>(API_URL + 'get-all', filterData, { params });
  }

  getAllCarouselsWithCache(filterData: FilterData, searchQuery?: string, refresh?: boolean) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }

    return new Observable<{ data: Carousel[]; count: number; success: boolean }>((observer) => {
      if (this.carouselResponse && !refresh) {
        observer.next(this.carouselResponse);
        observer.complete()
      } else {
        this.httpClient.post<{ data: Carousel[], count: number, success: boolean }>(API_URL + 'get-all/', filterData, { params })
          .subscribe({
            next: res => {
              this.carouselResponse = res;
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

  /**
   * getAllCarousel
   */

  getAllCarousel(): Observable<{
    data: Carousel[];
    success: boolean;
    message: string;
  }> {
    if (this.carouselCache.has(this.cacheKey)) {
      return of(this.carouselCache.get(this.cacheKey) as {
        data: Carousel[];
        success: boolean;
        message: string;
      });
    }

    return this.httpClient
      .get<{
        data: Carousel[];
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
