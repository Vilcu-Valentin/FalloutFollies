import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // Adjust the path as necessary

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { 
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
      const { email, password, firstName, lastName } = this.registerForm.value;
      this.authService.register(email, password, firstName, lastName).subscribe({
        next: () => {
          // After successful registration, perform login
          this.authService.login(email, password).subscribe({
            next: (response) => {
              this.router.navigate(['/main-page']); 
            },
            error: (error) => {
              console.error('Auto-login failed', error);
            }
          });
        },
        error: (error) => {
          console.error('Registration failed', error);
        }
      });
  }
    
}
