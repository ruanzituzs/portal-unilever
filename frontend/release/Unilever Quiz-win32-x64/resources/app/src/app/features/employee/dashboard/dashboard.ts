import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth';
import { QuizzesService, Quiz } from '../../../core/services/quizzes.service';
import { GamificationService, LeaderboardEntry } from '../../../core/services/gamification.service';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class EmployeeDashboard implements OnInit {
  quizzes: Quiz[] = [];
  leaderboard: LeaderboardEntry[] = [];
  myStats: LeaderboardEntry | null = null; // For leaderboard footer
  heroStats: LeaderboardEntry | null = null; // For hero section stats
  userName: string = 'Colaborador';
  userRole: string = 'Employee';

  constructor(
    private authService: AuthService,
    private quizzesService: QuizzesService,
    private gamificationService: GamificationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadQuizzes();
    this.loadGamification();

    // Get user info
    const token = this.authService.getToken();
    console.log('Dashboard Token:', token); // Debug
    if (token) {
      const decoded: any = this.authService.decodeToken(token);
      console.log('Decoded Token:', decoded); // Debug
      if (decoded) {
        this.userName = decoded.name || 'Colaborador';
        this.userRole = decoded.role === 'MANAGER' ? 'Gestor' : 'Colaborador';
      }
    }
  }


  loadQuizzes() {
    this.quizzesService.getQuizzes().subscribe(allQuizzes => {
      // Filter out quizzes that have already been passed
      const quizCheckPromises = allQuizzes.map(quiz =>
        this.quizzesService.getAttempt(quiz.id).toPromise()
          .then(attempt => ({ quiz, alreadyPassed: attempt?.passed === true }))
          .catch(() => ({ quiz, alreadyPassed: false }))
      );

      Promise.all(quizCheckPromises).then(results => {
        this.quizzes = results
          .filter(result => !result.alreadyPassed)
          .map(result => result.quiz);
      });
    });
  }

  loadGamification() {
    this.gamificationService.getLeaderboard().subscribe(data => {
      this.leaderboard = data;
    });

    this.gamificationService.getMyStats().subscribe(data => {
      this.heroStats = data; // Always keep stats for hero section
      this.myStats = data;
      // If my rank is within the leaderboard length (e.g. top 10), hide myStats footer to avoid duplication
      if (this.myStats && this.myStats.rank && this.myStats.rank <= this.leaderboard.length) {
        this.myStats = null;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  startQuiz(quizId: string) {
    this.router.navigate(['/quiz', quizId]);
  }

  viewInitiatives() {
    const element = document.getElementById('quizzes-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
