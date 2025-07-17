import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
 , imports: [RouterModule] })
export class AdminDashboardComponent { // Add FormsModule here if using ngModel in the template
  constructor(private auth: Auth, private router: Router) {}

  async onLogout() {
    try {
      await this.auth.signOut();
      this.router.navigate(['/admin/login']);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
}
