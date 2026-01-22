// src/app/services/csrf-token.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../environments/environment';

const API_URL = environment.apiBaseLink + '/api/';

@Injectable({ providedIn: 'root' })
export class CsrfTokenService {
  private token: string | null = null;

  constructor(private http: HttpClient) {}

  loadToken(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http
        .get<{ csrfToken: string }>(API_URL + 'csrf-token', { withCredentials: true })
        .subscribe({
          next: (res) => {
            this.token = res.csrfToken;
            resolve();
          },
          error: (err) => reject(err)
        });
    });
  }

  getToken(): string | null {
    return this.token;
  }
}
