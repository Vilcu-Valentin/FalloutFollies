import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7088/api'; 

  constructor(private http: HttpClient) { }

  // In authService.ts
login(email: string, password: string): Observable<any> {
  return this.http.post<any>(`https://localhost:7088/api/User/login`, { email, password });
}

register(email: string, password: string, firstName: string, lastName: string): Observable<any> {
  return this.http.post<any>(`https://localhost:7088/api/User/register`, { email, password, firstName, lastName });
}

}
