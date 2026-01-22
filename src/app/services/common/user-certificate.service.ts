import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {Observable} from "rxjs";

import { UserCertificate } from 'src/app/interfaces/common/user-certificate.interface';
import {FilterData} from "../../interfaces/core/filter-data.interface";

const API_BRAND = environment.apiBaseLink + '/api/user-certificate/';


@Injectable({
  providedIn: 'root'
})
export class UserCertificateService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addUserCertificate
   * insertManyUserCertificate
   * getAllUserCertificates
   * getUserCertificateById
   * updateUserCertificateById
   * updateMultipleUserCertificateById
   * deleteUserCertificateById
   * deleteMultipleUserCertificateById
   */

  addUserCertificate(data: UserCertificate):Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_BRAND + 'add', data);
  }

  getAllUserCertificates(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: UserCertificate[], count: number, success: boolean }>(API_BRAND + 'get-all/', filterData, {params});
  }

  getUserCertificateById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: UserCertificate, message: string, success: boolean }>(API_BRAND + 'get-by/' + id, {params});
  }

  updateUserCertificateById(id: string, data: UserCertificate) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_BRAND + 'update/' + id, data);
  }

  deleteUserCertificateById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_BRAND + 'delete/' + id, {params});
  }

  deleteMultipleUserCertificateById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_BRAND + 'delete-multiple', {ids: ids}, {params});
  }



}
