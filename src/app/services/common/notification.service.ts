import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { Notification } from '../../interfaces/common/notification.interface';
import { FilterData } from '../../interfaces/core/filter-data.interface';

const API_URL = environment.apiBaseLink + '/api/notification/';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly httpClient = inject(HttpClient);

  /**
   * addNotification()
   * getAllNotifications()
   * getNotificationById()
   * updateNotificationById()
   * deleteNotificationById()
   * sendNotificationToCourseStudents()
   * sendNotificationWithCircular()
   */
  addNotification(data: Notification) {
    return this.httpClient.post<ResponsePayload>(API_URL + 'add', data);
  }

  sendNotificationWithCircular(data: Notification) {
    return this.httpClient.post<ResponsePayload>(API_URL + 'send-with-circular', data);
  }

  getAllNotifications(filterData?: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    
    // Add filter parameters
    if (filterData?.filter) {
      const filter = filterData.filter;
      if (filter.type) {
        params = params.append('type', filter.type);
      }
      if (filter.courseId) {
        params = params.append('courseId', filter.courseId);
      }
      if (filter.status) {
        params = params.append('status', filter.status);
      }
      if (filter.targetAudience) {
        params = params.append('targetAudience', filter.targetAudience);
      }
    }
    
    // Add pagination
    if (filterData?.pagination) {
      if (filterData.pagination.currentPage !== undefined) {
        params = params.append('currentPage', filterData.pagination.currentPage.toString());
      }
      if (filterData.pagination.pageSize !== undefined) {
        params = params.append('pageSize', filterData.pagination.pageSize.toString());
      }
    }
    
    return this.httpClient.get<ResponsePayload>(
      API_URL + 'get-all',
      { params },
    );
  }

  getNotificationById(id: string) {
    return this.httpClient.get<{ data: Notification; success: boolean }>(
      API_URL + 'get/' + id,
    );
  }

  updateNotificationById(id: string, data: Partial<Notification>) {
    return this.httpClient.put<ResponsePayload>(API_URL + 'update/' + id, data);
  }

  deleteNotificationById(id: string) {
    return this.httpClient.delete<ResponsePayload>(API_URL + 'delete/' + id);
  }

  sendNotificationToCourseStudents(id: string) {
    return this.httpClient.post<ResponsePayload>(API_URL + 'send-to-course-students/' + id, {});
  }

  markAsRead(id: string, userId: string) {
    return this.httpClient.post<ResponsePayload>(API_URL + 'mark-as-read/' + id, { userId });
  }
}

