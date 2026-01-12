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

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    private apiUrl = `${environment.apiUrl}/analytics`;

    constructor(private http: HttpClient) { }

    getDashboardStats(): Observable<DashboardStats> {
        return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard`);
    }
}
