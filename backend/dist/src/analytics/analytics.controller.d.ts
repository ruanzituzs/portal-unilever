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
}
