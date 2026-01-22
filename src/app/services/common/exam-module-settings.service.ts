import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ExamModuleSettings } from '../../interfaces/common/exam-module-settings.interface';

const API_URL = environment.apiBaseLink + '/api/exam-module-settings/';

@Injectable({
  providedIn: 'root'
})
export class ExamModuleSettingsService {
  private readonly httpClient = inject(HttpClient);

  getSettings() {
    return this.httpClient.get<{ data: ExamModuleSettings, success: boolean, message: string }>(
      API_URL
    );
  }
}
