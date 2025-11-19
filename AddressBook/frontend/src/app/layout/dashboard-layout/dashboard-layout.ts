import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-layout.html',
  styleUrls: ['./dashboard-layout.css'],
})
export class DashboardLayoutComponent {
  userName = '';
  collapsed = false;
  mobileOpen = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem('userName') ?? 'User';
  }

  toggleResponsiveSidebar() {
    if (window.innerWidth <= 991) {
      this.mobileOpen = !this.mobileOpen;
    } else {
      this.collapsed = this.collapsed;
    }
  }

  closeMobileSidebar() {
    if (window.innerWidth <= 991 && this.mobileOpen) {
      this.mobileOpen = false;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this.router.navigate(['/auth/login']);
  }
}
