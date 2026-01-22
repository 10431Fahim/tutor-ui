// src/app/interceptors/csrf.interceptor.ts
import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CsrfTokenService} from '../services/core/csrf-token.service';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  constructor(private csrfTokenService: CsrfTokenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.csrfTokenService.getToken();

    // শুধু unsafe method (POST/PUT/DELETE) এ token attach করব
    const isUnsafeMethod = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method);

    if (token && isUnsafeMethod) {
      const cloned = req.clone({
        withCredentials: true,
        setHeaders: {
          'X-CSRF-Token': token
        }
      });
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}
