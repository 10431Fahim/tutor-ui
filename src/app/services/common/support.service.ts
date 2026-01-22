import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { Observable } from 'rxjs';

const API_URL = environment.apiBaseLink + '/api/support/';

export interface SupportTicket {
  _id?: string;
  phone: string;
  category: 'course' | 'exam' | 'payment' | 'technical' | 'other';
  courseId?: string;
  examId?: string;
  message: string;
  preferredChannel?: 'ai' | 'human';
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  aiAnswer?: string;
  assignedTo?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AiAskRequest {
  question: string;
  context?: {
    courseId?: string;
    examId?: string;
    category?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class SupportService {
  private readonly httpClient = inject(HttpClient);

  /**
   * Create a support ticket
   */
  createTicket(ticket: Partial<SupportTicket>): Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_URL + 'ticket', ticket);
  }

  /**
   * Get my tickets (for students)
   */
  getMyTickets(): Observable<ResponsePayload> {
    return this.httpClient.get<ResponsePayload>(API_URL + 'tickets?mine=true');
  }

  /**
   * Get all tickets (for admin/support staff)
   */
  getAllTickets(filter?: any): Observable<ResponsePayload> {
    let params = new HttpParams();
    if (filter) {
      Object.keys(filter).forEach((key) => {
        if (filter[key] !== undefined && filter[key] !== null) {
          params = params.set(key, filter[key]);
        }
      });
    }
    return this.httpClient.get<ResponsePayload>(API_URL + 'tickets', { params });
  }

  /**
   * Update ticket status (for admin/support staff)
   */
  updateTicket(ticketId: string, update: Partial<SupportTicket>): Observable<ResponsePayload> {
    return this.httpClient.patch<ResponsePayload>(API_URL + `tickets/${ticketId}`, update);
  }

  /**
   * Ask AI assistant
   */
  askAi(request: AiAskRequest): Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_URL + 'ai/ask', request);
  }
}
