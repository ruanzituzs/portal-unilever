import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AnalyticsService, UserAnalytics } from '../../../../core/services/analytics.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-employee-analytics-page',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './employee-analytics-page.html',
  styleUrl: './employee-analytics-page.scss'
})
export class EmployeeAnalyticsPageComponent implements OnInit {
  userId: string | null = null;
  analytics: UserAnalytics | null = null;
  loading = true;

  // Radar Chart (Performance Categories)
  public radarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      r: {
        angleLines: { display: false },
        suggestedMin: 0,
        suggestedMax: 100
      }
    }
  };
  public radarChartData: ChartData<'radar'> = { labels: [], datasets: [] };
  public radarChartType: ChartType = 'radar';

  // Line Chart (Progress)
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: { y: { suggestedMin: 0, suggestedMax: 100 } }
  };
  public lineChartData: ChartData<'line'> = { labels: [], datasets: [] };
  public lineChartType: ChartType = 'line';

  // Bar Chart (Accuracy)
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: { y: { suggestedMin: 0, suggestedMax: 100 } }
  };
  public barChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  public barChartType: ChartType = 'bar';

  // Doughnut Chart (Speed)
  public speedChartOptions: any = {
    responsive: true,
    cutout: '70%'
  };
  public speedChartData: ChartData<'doughnut'> = { labels: ['Tempo Médio (s)', 'Média da Equipe'], datasets: [] };
  public speedChartType: ChartType = 'doughnut';


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private analyticsService: AnalyticsService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId');
    if (this.userId) {
      this.loadAnalytics();
    } else {
      this.goBack();
    }
  }

  loadAnalytics() {
    this.loading = true;
    this.analyticsService.getUserAnalytics(this.userId!).subscribe({
      next: (data) => {
        this.analytics = data;
        this.setupCharts();
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load analytics', err);
        this.loading = false;
      }
    });
  }

  setupCharts() {
    if (!this.analytics) return;

    // Setup Radar
    this.radarChartData = {
      labels: this.analytics.performanceCategories.map(c => c.category),
      datasets: [
        { data: this.analytics.performanceCategories.map(c => c.score), label: 'Colaborador', fill: true },
        { data: this.analytics.performanceCategories.map(c => c.teamAvg), label: 'Média Equipe', fill: true },
        { data: this.analytics.performanceCategories.map(c => c.globalAvg), label: 'Média Global', fill: true }
      ]
    };

    // Setup Line
    this.lineChartData = {
      labels: this.analytics.progressOverTime.map(p => p.month),
      datasets: [
        { data: this.analytics.progressOverTime.map(p => p.score), label: 'Desempenho Geral', fill: false, tension: 0.1 }
      ]
    };

    // Setup Bar
    this.barChartData = {
      labels: this.analytics.accuracyByDifficulty.map(a => a.difficulty),
      datasets: [
        { data: this.analytics.accuracyByDifficulty.map(a => a.accuracy), label: 'Precisão (%)' }
      ]
    };

    // Setup Speed Doughnut
    this.speedChartData = {
      labels: ['Velocidade do Colaborador', 'Diferença para Equipe'],
      datasets: [
        {
          data: [this.analytics.speedIndex, Math.max(0, this.analytics.teamSpeedAvg - this.analytics.speedIndex)],
          backgroundColor: ['#22c55e', '#e2e8f0']
        }
      ]
    };
  }

  goBack() {
    this.location.back();
  }
}
