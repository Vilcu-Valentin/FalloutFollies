// admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { UserManagementService, UserDetails } from '../../services/user-management.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  users: UserDetails[] = [];
  currentUserEmail: string = '';

  constructor(private userManagementService: UserManagementService,
              public authService: AuthService) { }

  ngOnInit() {
    this.loadUsers();
    this.currentUserEmail = this.authService.getCurrentUserEmail();
  }

  loadUsers() {
    this.userManagementService.getAllUsers().subscribe({
      next: (response: any) => {
        this.users = response.$values;

        console.log('Users array:', this.users); 
      },
      error: (error) => console.error('Error fetching users', error),
    });    
  }

  promoteToAdmin(email: string) {
    this.userManagementService.changeUserRole(email, 'Admin').subscribe(() => {
      this.loadUsers(); 
    });
  }

  demoteToUser(email: string) {
    this.userManagementService.changeUserRole(email, 'User').subscribe(() => {
      this.loadUsers(); 
    });
  }

  deleteUser(email: string) {
    if (confirm(`Are you sure you want to delete ${email}?`)) {
      this.userManagementService.deleteUser(email).subscribe(() => {
        this.loadUsers(); 
      });
    }
  }
}
