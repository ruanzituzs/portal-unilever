import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboardStats(): Promise<{
        totalUsers: number;
        totalQuizzes: number;
        totalAttempts: number;
        averageScore: number;
    }>;
    getUserAnalytics(id: string): Promise<{
        userId: string;
        name: string;
        email: string;
        department: string;
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
            date: Date;
        }[];
        performanceCategories: {
            category: string;
            score: number;
            teamAvg: number;
            globalAvg: number;
        }[];
        progressOverTime: {
            month: string;
            score: number;
        }[];
        accuracyByDifficulty: {
            difficulty: string;
            accuracy: number;
        }[];
        speedIndex: number;
        teamSpeedAvg: number;
    }>;
}
