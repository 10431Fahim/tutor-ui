import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';

const API_OTP = environment.apiBaseLink + '/api/otp/';


@Injectable({
  providedIn: 'root'
})
export class OtpService {

  // Inject
  private readonly httpClient = inject(HttpClient);


  /**
   * generateOtpWithPhoneNo()
   * validateOtpWithPhoneNo()
   */

  generateOtpWithPhoneNo(phoneNo: string) {
    return this.httpClient.post<ResponsePayload>
      (API_OTP + 'generate-otp', { phoneNo });
  }

  // validateOtpWithPhoneNo(phoneNo: string, code: string) {
  //   const data = { phoneNo, code }
  //   return this.httpClient.post<ResponsePayload>
  //     (API_OTP + 'validate-otp', data);
  // }


  validateOtpWithPhoneNo(data: { phoneNo: string, code: string }) {
    return this.httpClient.post<ResponsePayload>
    (API_OTP + 'validate-otp', data);
  }


  validateOtpWithEmail(data: { email: string, code: string }) {
    return this.httpClient.post<ResponsePayload>
    (API_OTP + 'validate-otp-with-email', data);
  }

  generateOtpWithEmail(email: string) {
    return this.httpClient.post<ResponsePayload>
    (API_OTP + 'generate-otp-with-email', {email});
  }

}
