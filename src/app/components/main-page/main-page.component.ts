import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Adjust the path as necessary

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  userEmail: string | null = localStorage.getItem('userEmail');

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userEmail = localStorage.getItem('userEmail'); // This key must match what you've set on login
  }  

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
