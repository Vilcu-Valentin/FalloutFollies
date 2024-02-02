// auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7088/api/Authentication'; 

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      map(response => {
        if (response.token) {
          localStorage.setItem('jwtToken', response.token);
          localStorage.setItem('userEmail', email); // Store the email in localStorage
          console.log('Login successful');
        }
        return response;
      }),
      catchError(error => {
        console.error('Login failed', error);
        return throwError(error);
      })
    );
  }
  

  register(email: string, password: string, firstName: string, lastName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { email, password, firstName, lastName }).pipe(
      map(response => {
        console.log('Registration successful', response);
        return response;
      }),
      catchError(error => {
        console.error('Registration failed', error);
        return throwError(error);
      })
    );
  }

  logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userEmail'); 
    console.log('Logout successful');
  }  
  
}
