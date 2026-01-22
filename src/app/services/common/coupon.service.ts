import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';

const API_TAG = environment.apiBaseLink + '/api/coupon/';


@Injectable({
  providedIn: 'root'
})
export class CouponService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * checkCouponAvailability
   */

  checkCouponAvailability(data: {couponCode: string, course: string; subTotal: number}) {
    return this.httpClient.post<ResponsePayload>
    (API_TAG + 'check-coupon-availability', data);
  }


}
