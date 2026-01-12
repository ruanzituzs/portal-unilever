
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/auth';
import { AnalyticsService, DashboardStats } from '../../../core/services/analytics.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalUsers: 0,
    totalQuizzes: 0,
    totalAttempts: 0,
    averageScore: 0
  };

  menuItems = [
    { label: 'Visão Geral', icon: 'home', link: '/admin' },
    { label: 'Gerenciar Vídeos', icon: 'video-camera', link: '/admin/videos' },
    { label: 'Gerenciar Quizzes', icon: 'pencil-alt', link: '/admin/quizzes' },
    { label: 'Relatórios', icon: 'chart-bar', link: '/admin/reports' },
  ];

  constructor(
    private authService: AuthService,
    private analyticsService: AnalyticsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.analyticsService.getDashboardStats().subscribe(data => {
      this.stats = data;
    });
  }

  isActive(link: string): boolean {
    return this.router.url === link;
  }

  getIcon(icon: string): string {
    const icons: { [key: string]: string } = {
      'home': 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      'video-camera': 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
      'pencil-alt': 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
      'chart-bar': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
    };
    return icons[icon] || icons['home'];
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
