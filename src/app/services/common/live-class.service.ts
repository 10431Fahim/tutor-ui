import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { LiveClass } from '../../interfaces/common/live-class.interface';
import { FilterData } from '../../interfaces/core/filter-data.interface';

const API_URL = environment.apiBaseLink + '/api/live-class/';

@Injectable({
  providedIn: 'root',
})
export class LiveClassService {
  private readonly httpClient = inject(HttpClient);

  /**
   * addLiveClass()
   * getAllLiveClasses()
   * getLiveClassById()
   * updateLiveClassById()
   * deleteLiveClassById()
   * joinLiveClass()
   * endLiveClass()
   * uploadRecording()
   */
  addLiveClass(data: LiveClass) {
    return this.httpClient.post<ResponsePayload>(API_URL + 'add', data);
  }

  getAllLiveClasses(filterData?: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.get<{ data: { data: LiveClass[]; count: number }; success: boolean }>(
      API_URL + 'get-all',
      { params },
    );
  }

  getLiveClassById(id: string) {
    return this.httpClient.get<{ data: LiveClass; success: boolean }>(
      API_URL + 'get/' + id,
    );
  }

  updateLiveClassById(id: string, data: Partial<LiveClass>) {
    return this.httpClient.put<ResponsePayload>(API_URL + 'update/' + id, data);
  }

  deleteLiveClassById(id: string) {
    return this.httpClient.delete<ResponsePayload>(API_URL + 'delete/' + id);
  }

  joinLiveClass(id: string, userId: string) {
    return this.httpClient.post<ResponsePayload>(API_URL + 'join/' + id, { userId });
  }

  endLiveClass(id: string) {
    return this.httpClient.post<ResponsePayload>(API_URL + 'end/' + id, {});
  }

  uploadRecording(id: string, recordedClassUrl: string) {
    return this.httpClient.post<ResponsePayload>(API_URL + 'upload-recording/' + id, { recordedClassUrl });
  }
}



