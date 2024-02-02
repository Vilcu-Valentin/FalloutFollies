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
    if (this.registerForm.valid) {
      const { email, password, firstName, lastName } = this.registerForm.value;
      this.authService.register(email, password, firstName, lastName).subscribe({
        next: () => {
          // After successful registration, perform login
          this.authService.login(email, password).subscribe({
            next: (response) => {
              console.log('Login successful after registration', response);
              // Assuming your response includes the user's name or email, you can store it now
              localStorage.setItem('userEmail', email); // Storing the email or username for greeting
              this.router.navigate(['/main-page']); // Adjust this to your main page's route
            },
            error: (error) => {
              console.error('Auto-login failed', error);
              // Optionally handle auto-login failure here, maybe redirect to login page manually
            }
          });
        },
        error: (error) => {
          console.error('Registration failed', error);
          // Handle registration error here
        }
      });
    }
  }
    
}
