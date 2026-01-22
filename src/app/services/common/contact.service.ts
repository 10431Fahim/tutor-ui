import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { Contact } from 'src/app/interfaces/common/contact-us.interface';

const API_URL = environment.apiBaseLink + '/api/contact-us/';


@Injectable({
  providedIn: 'root'
})
export class ContactService {

  // Inject
  private readonly httpClient = inject(HttpClient);

  /**
   * addContact()
   */

  addContact(data: Contact) {
    return this.httpClient.post<ResponsePayload>
      (API_URL + 'add', data);
  }

}
