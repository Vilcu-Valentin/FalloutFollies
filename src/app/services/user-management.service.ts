import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; 

export interface UserRole {
    $id: string;
    $values: string[];
}

export interface UserDetails {
    $id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: UserRole;
}


@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private apiUrl = 'https://localhost:7088/api/user';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
  }

  getAllUsers(): Observable<UserDetails[]> {
    return this.http.get<UserDetails[]>(`${this.apiUrl}`, { headers: this.getHeaders() });
  }

  changeUserRole(email: string, roleName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/ChangeRole`, { email, roleName }, { headers: this.getHeaders() });
  }

  deleteUser(email: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${email}`, { headers: this.getHeaders(), responseType: 'text' });
  }
  
}
