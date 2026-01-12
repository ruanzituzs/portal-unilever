import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LeaderboardEntry {
    rank: number;
    userId: string;
    name: string;
    department: string | null;
    score: number;
    quizzesTaken: number;
}

@Injectable({
    providedIn: 'root'
})
export class GamificationService {
    private apiUrl = `${environment.apiUrl}/gamification`;

    constructor(private http: HttpClient) { }

    getLeaderboard(limit: number = 10): Observable<LeaderboardEntry[]> {
        return this.http.get<LeaderboardEntry[]>(`${this.apiUrl}/leaderboard?limit=${limit}`);
    }

    getMyStats(): Observable<LeaderboardEntry> {
        return this.http.get<LeaderboardEntry>(`${this.apiUrl}/my-stats`);
    }
}
