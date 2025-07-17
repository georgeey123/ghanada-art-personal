import { Component } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login-page',
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-login-page.html',
  styleUrl: './admin-login-page.css'
})
export class AdminLoginPage {
  email = '';
  password = '';
  errorMessage: string | null = null;

  constructor(private auth: Auth, private router: Router) {}

  async onLogin(event: Event) {
    event.preventDefault(); // Prevent default form submission
    this.errorMessage = null; // Clear previous errors

    try {
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
      // Login successful, navigate to admin dashboard
      this.router.navigate(['/admin']);
    } catch (error: any) {
      // Handle login errors
      this.errorMessage = error.message;
      console.error('Login error:', error);
    }
  }

}