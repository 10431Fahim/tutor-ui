import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {ResponsePayload} from "../../interfaces/core/response-payload.interface";
import {SslInit} from "../../interfaces/common/ssl-init";

const API_URL = environment.apiBaseLink + '/api/payment/';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  // Inject
  private readonly httpClient = inject(HttpClient);


  /**
   * SSL COMMERCE
   * initSslPayment()
   */

  initSslPayment(data: SslInit) {
    return this.httpClient.post<ResponsePayload>
    (API_URL + 'init-ssl', data);
  }

  /**
   * Bkash
   * createBkashPayment()
   * callbackBkashPayment()
   */

  createBkashPayment(data: any) {
    return this.httpClient.post<{ success: boolean, data: { bkashURL: string, paymentID: string } }>
      (API_URL + 'create-bkash-payment', data);
  }

  callbackBkashPayment(data: any) {
    return this.httpClient.post<{ success: boolean, data: { statusCode: string, message: string } }>
      (API_URL + 'callback-bkash-payment', data);
  }

  callbackBkashProductPayment(data: any) {
    return this.httpClient.post<{ success: boolean, data: { statusCode: string, message: string } }>
      (API_URL + 'callback-bkash-product-payment', data);
  }

}
