import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { User } from '../../interfaces/common/user.interface';
import { Subject } from 'rxjs';

const API_URL = environment.apiBaseLink + '/api/user/';


@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  userDataPass = new Subject<any>();

  // Inject
  private readonly httpClient = inject(HttpClient);


  /**
   * getUserData()
   * passUserData()
   */

  get getUserData() {
    return this.userDataPass;
  }

  passUserData(data: User) {
    this.userDataPass.next(data);
  }


  /**
   * getLoggedInUserData()
   * updateLoggedInUserInfo()
   * changeLoggedInUserPassword()
   */

  getLoggedInUserData(select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }

    return this.httpClient.get<{ data: User }>(API_URL + 'logged-in-user-data', { params });
  }

  updateLoggedInUserInfo(data: User) {
    return this.httpClient.put<ResponsePayload>(API_URL + 'update-logged-in-user', data);
  }

  changeLoggedInUserPassword(data: { password: string, oldPassword: string }) {
    return this.httpClient.put<ResponsePayload>(API_URL + 'change-logged-in-user-password', data);
  }

}
