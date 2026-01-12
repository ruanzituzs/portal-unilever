import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';

  constructor(private http: HttpClient) { }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<{ access_token: string }>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.access_token) {
            localStorage.setItem('token', response.access_token);
            // In real app, decode token to get role
          }
        })
      );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logout() {
    localStorage.removeItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  decodeToken(token: string) {
    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  }
}
