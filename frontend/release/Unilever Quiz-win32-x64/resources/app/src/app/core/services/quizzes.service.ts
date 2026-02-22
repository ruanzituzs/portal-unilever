import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Video } from './videos.service';
import { environment } from '../../../environments/environment';

export interface Answer {
    id?: string;
    text: string;
    isCorrect: boolean;
}

export interface Question {
    id?: string;
    text: string;
    answers: Answer[];
}

export interface Quiz {
    id: string;
    title: string;
    description: string;
    minScore: number;
    videoId?: string;
    video?: Video;
    questions?: Question[];
}

@Injectable({
    providedIn: 'root'
})
export class QuizzesService {
    private apiUrl = `${environment.apiUrl}/quizzes`;

    constructor(private http: HttpClient) { }

    getQuizzes(): Observable<Quiz[]> {
        return this.http.get<Quiz[]>(this.apiUrl);
    }

    getQuiz(id: string): Observable<Quiz> {
        return this.http.get<Quiz>(`${this.apiUrl}/${id}`);
    }

    createQuiz(quiz: any): Observable<Quiz> {
        return this.http.post<Quiz>(this.apiUrl, quiz);
    }

    generateAiQuiz(videoId: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/generate-ai`, { videoId });
    }

    submitAttempt(quizId: string, score: number, passed: boolean): Observable<any> {
        return this.http.post(`${this.apiUrl}/${quizId}/attempt`, { score, passed });
    }

    getAttempt(quizId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/${quizId}/attempt`);
    }

    deleteQuiz(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
