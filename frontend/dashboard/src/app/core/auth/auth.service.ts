import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginPayload, LoginResponse } from '../models/login.interface';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'access_token';
  private refreshKey = 'refresh_token';

  constructor(private http: HttpClient) { }

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/api/v1/auth/login`, payload)
      .pipe(tap(res => {
        localStorage.setItem(this.tokenKey, res.data.token);
        if (res.data.refreshToken) localStorage.setItem(this.refreshKey, res.data.refreshToken);
      }));
  }

  refresh(): Observable<{ data: { token: string } }> {
    const refreshToken = localStorage.getItem(this.refreshKey);
    return this.http.post<{ data: { token: string } }>(`${environment.apiUrl}/v1/auth/refresh`, { refreshToken })
      .pipe(tap(res => localStorage.setItem(this.tokenKey, res.data.token)));
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
