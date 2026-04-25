import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
    totalUsers: number;
    totalQuizzes: number;
    totalAttempts: number;
    averageScore: number;
}

export interface UserAnalytics {
    userId: string;
    name: string;
    email: string;
    department?: string;
    role: string;
    level: number;
    xp: number;
    quizzesPassed: number;
    quizzesFailed: number;
    averageScore: number;
    averageSpeed: number;
    recentActivity: {
        id: string;
        title: string;
        score: number;
        passed: boolean;
        date: string;
    }[];
    performanceCategories: { category: string; score: number; teamAvg: number; globalAvg: number }[];
    progressOverTime: { month: string; score: number }[];
    accuracyByDifficulty: { difficulty: string; accuracy: number }[];
    speedIndex: number;
    teamSpeedAvg: number;
}

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    private apiUrl = `${environment.apiUrl}/analytics`;

    constructor(private http: HttpClient) { }

    getDashboardStats(): Observable<DashboardStats> {
        return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard`);
    }

    getUserAnalytics(userId: string): Observable<UserAnalytics> {
        return this.http.get<UserAnalytics>(`${this.apiUrl}/user/${userId}`);
    }
}
