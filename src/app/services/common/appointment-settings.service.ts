import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AppointmentSettings } from '../../interfaces/common/appointment-settings.interface';

const API_URL = environment.apiBaseLink + '/api/appointment-settings/';

@Injectable({
  providedIn: 'root'
})
export class AppointmentSettingsService {
  private readonly httpClient = inject(HttpClient);

  getSettings() {
    return this.httpClient.get<{ data: AppointmentSettings, success: boolean, message: string }>(
      API_URL
    );
  }
}
