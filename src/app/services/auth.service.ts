import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map, switchMap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { UserDetailsDto } from '../shared/UserDetailsDto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7088/api/Authentication'; 

  constructor(private http: HttpClient) { }

login(email: string, password: string): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
    map(response => {
      if (response && response.token) {
        this.setToken(response.token.result);
        console.log(response);
      }
      return response;
    }),
    catchError(error => {
      console.error('Login failed', error);
      return throwError(error);
    })
  );
}

getUserDetails(): Observable<UserDetailsDto> {
  const userId = this.getUserIdFromToken();
  return this.http.get<UserDetailsDto>(`${this.apiUrl}/User/${userId}`);
}
  

register(email: string, password: string, firstName: string, lastName: string): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/register`, { email, password, firstName, lastName }).pipe(
    tap(() => {
      console.log("Registration successful, attempting login...");
      this.login(email, password).subscribe({
        next: loginResponse => {
          console.log("Login successful after registration", loginResponse);
          // Additional logic after successful login, if needed
        },
        error: loginError => console.error("Auto-login failed", loginError)
      });
    }),
    catchError(error => {
      console.error('Registration failed', error);
      return throwError(error);
    })
  );
}


  logout() {
    localStorage.removeItem('token');
    console.log('Logout successful');
  }  

  setToken(token: string): void{
    localStorage.setItem('token', token);
  }

  getToken(): any {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
  }

  getDecodedToken(): any {
    const token = this.getToken();
    return jwtDecode(token);
  }

  getUserIdFromToken(): string | null {
    return this.getDecodedToken() ? this.getDecodedToken().nameid : null;
  }

  getCurrentUserEmail(): string {
    return this.getDecodedToken() ? this.getDecodedToken().email : null;
  }

  isAdmin(): boolean {
    if(this.getDecodedToken().role == "Admin")
      return true;
    else
      return false;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token;
  }
  
}
