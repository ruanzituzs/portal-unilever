import { PrismaService } from '../prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        totalUsers: number;
        totalQuizzes: number;
        totalAttempts: number;
        averageScore: number;
    }>;
}
