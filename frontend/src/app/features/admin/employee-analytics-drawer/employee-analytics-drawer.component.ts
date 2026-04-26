import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnalyticsService, UserAnalytics } from '../../../core/services/analytics.service';

@Component({
  selector: 'app-employee-analytics-drawer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Overlay -->
    <div *ngIf="isOpen" 
         class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
         (click)="close()">
    </div>

    <!-- Drawer -->
    <div class="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col"
         [class.translate-x-full]="!isOpen"
         [class.translate-x-0]="isOpen">
         
        <!-- Header -->
        <div class="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div>
                <h2 class="text-xl font-bold text-slate-800">Análise do Colaborador</h2>
                <p class="text-sm text-slate-500 mt-1">Métricas individuais de engajamento</p>
            </div>
            <button (click)="close()" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6">
            
            <div *ngIf="loading" class="flex flex-col items-center justify-center h-48 space-y-4">
                <svg class="animate-spin h-10 w-10 text-[#005A9C]" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-slate-500 font-medium">Carregando dados...</span>
            </div>

            <div *ngIf="error" class="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 flex items-start gap-3">
                 <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-sm">{{ error }}</p>
            </div>

            <div *ngIf="!loading && !error && analytics">
                
                <!-- Profile Header -->
                <div class="flex items-center gap-4 mb-8">
                    <div class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-[#005A9C]">
                        {{ analytics.name.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-slate-800">{{ analytics.name }}</h3>
                        <p class="text-sm text-slate-500">{{ analytics.email }}</p>
                        <div class="flex gap-2 mt-2">
                            <span class="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded border border-slate-200">
                                {{ analytics.role === 'MANAGER' ? 'Gestor' : 'Promotor' }}
                            </span>
                            <span *ngIf="analytics.department" class="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded border border-slate-200">
                                {{ analytics.department }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- KPI Grid -->
                <div class="grid grid-cols-2 gap-4 mb-8">
                    <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                        <div class="text-sm text-slate-500 mb-1 font-medium">Nível Atual</div>
                        <div class="text-3xl font-bold text-[#005A9C]">{{ analytics.level }}</div>
                        <div class="text-xs text-slate-400 mt-1">{{ analytics.xp }} XP Total</div>
                    </div>
                    <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                        <div class="text-sm text-slate-500 mb-1 font-medium">Pontuação Média</div>
                        <div class="text-3xl font-bold" [ngClass]="analytics.averageScore >= 70 ? 'text-green-600' : 'text-amber-500'">
                            {{ analytics.averageScore }}%
                        </div>
                        <div class="text-xs text-slate-400 mt-1">Acertos gerais</div>
                    </div>
                    <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                        <div class="text-sm text-slate-500 mb-1 font-medium">Quizzes Concluídos</div>
                        <div class="text-3xl font-bold text-slate-800">{{ analytics.quizzesPassed }}</div>
                        <div class="text-xs text-slate-400 mt-1"><span class="text-red-500">{{ analytics.quizzesFailed }}</span> falhas</div>
                    </div>
                    <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                        <div class="text-sm text-slate-500 mb-1 font-medium">Tempo Médio</div>
                        <div class="text-3xl font-bold text-slate-800">{{ analytics.averageSpeed }}s</div>
                        <div class="text-xs text-slate-400 mt-1">Por tentativa</div>
                    </div>
                </div>

                <!-- Recent Activity List -->
                <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Atividade Recente</h4>
                <div *ngIf="analytics.recentActivity.length === 0" class="text-center py-6 text-slate-500 text-sm">
                    Nenhuma atividade registrada ainda.
                </div>
                <div class="space-y-3">
                    <div *ngFor="let act of analytics.recentActivity" class="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full flex items-center justify-center" [ngClass]="act.passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'">
                                <svg *ngIf="act.passed" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                <svg *ngIf="!act.passed" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </div>
                            <div>
                                <div class="text-sm font-medium text-slate-800">Quiz {{ act.passed ? 'Aprovado' : 'Reprovado' }}</div>
                                <div class="text-xs text-slate-500">{{ act.date | date:'dd/MM/yyyy HH:mm' }}</div>
                            </div>
                        </div>
                        <div class="font-bold text-sm" [ngClass]="act.passed ? 'text-green-600' : 'text-red-600'">
                            {{ act.score }}%
                        </div>
                    </div>
                </div>

                <!-- Full Analytics Button -->
                <div class="mt-8">
                    <button [routerLink]="['/admin/analytics', analytics.userId]" (click)="close()" class="w-full py-3 bg-[#005A9C] text-white rounded-lg font-bold text-sm hover:bg-blue-800 transition-colors shadow-sm flex items-center justify-center gap-2">
                        <span>Ver Análise Completa</span>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </button>
                </div>

            </div>
        </div>
    </div>
  `
})
export class EmployeeAnalyticsDrawerComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() userId: string | null = null;
  @Output() closeDrawer = new EventEmitter<void>();

  analytics: UserAnalytics | null = null;
  loading = false;
  error: string | null = null;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen'] && this.isOpen && this.userId) {
      this.loadAnalytics();
    }
  }

  loadAnalytics() {
    if (!this.userId) return;
    this.loading = true;
    this.error = null;
    
    this.analyticsService.getUserAnalytics(this.userId).subscribe({
      next: (data) => {
        this.analytics = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading user analytics', err);
        this.error = 'Não foi possível carregar os dados deste colaborador.';
        this.loading = false;
      }
    });
  }

  close() {
    this.isOpen = false;
    this.closeDrawer.emit();
    setTimeout(() => {
        this.analytics = null;
        this.userId = null;
    }, 300); // Clear data after animation completes
  }
}
