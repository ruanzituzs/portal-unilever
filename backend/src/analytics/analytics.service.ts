import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) { }

    async getDashboardStats() {
        const totalUsers = await this.prisma.user.count({ where: { role: 'EMPLOYEE' } });
        const totalQuizzes = await this.prisma.quiz.count();
        const totalAttempts = await this.prisma.userQuizAttempt.count();

        // Calculate average score
        const aggregate = await this.prisma.userQuizAttempt.aggregate({
            _avg: {
                score: true
            }
        });

        return {
            totalUsers,
            totalQuizzes,
            totalAttempts,
            averageScore: Math.round(aggregate._avg.score || 0)
        };
    }
}
