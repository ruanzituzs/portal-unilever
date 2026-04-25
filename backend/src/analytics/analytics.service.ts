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
    async getUserAnalytics(userId: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('User not found');

        const attempts = await this.prisma.userQuizAttempt.findMany({
            where: { userId },
            include: { quiz: true, answers: true }
        });

        const passedQuizzes = attempts.filter(a => a.passed).length;
        const failedQuizzes = attempts.filter(a => !a.passed).length;
        
        const totalScore = attempts.reduce((acc, curr) => acc + curr.score, 0);
        const averageScore = attempts.length > 0 ? Math.round(totalScore / attempts.length) : 0;

        const totalTime = attempts.reduce((acc, curr) => acc + curr.timeTaken, 0);
        const averageSpeed = attempts.length > 0 ? Math.round(totalTime / attempts.length) : 0;

        const xp = passedQuizzes * 100;
        const level = Math.floor(xp / 300) + 1;

        // Group by category for Radar Chart
        const categoriesMap: Record<string, { total: number, count: number }> = {};
        attempts.forEach(a => {
            const cat = a.quiz.category || 'Geral';
            if (!categoriesMap[cat]) categoriesMap[cat] = { total: 0, count: 0 };
            categoriesMap[cat].total += a.score;
            categoriesMap[cat].count += 1;
        });

        // Get team and global averages for categories (Mocked/Simplified for now)
        // In a real app, query all attempts by user's team/department and global
        const performanceCategories = Object.keys(categoriesMap).map(cat => {
            const score = Math.round(categoriesMap[cat].total / categoriesMap[cat].count);
            // mock comparison data
            return {
                category: cat,
                score,
                teamAvg: Math.max(0, score - 5 - Math.floor(Math.random() * 10)),
                globalAvg: Math.max(0, score - 10 - Math.floor(Math.random() * 10))
            };
        });

        // If no categories, provide empty placeholders so radar chart renders
        if (performanceCategories.length === 0) {
            performanceCategories.push(
                { category: 'Liderança', score: 0, teamAvg: 0, globalAvg: 0 },
                { category: 'Vendas', score: 0, teamAvg: 0, globalAvg: 0 },
                { category: 'Compliance', score: 0, teamAvg: 0, globalAvg: 0 }
            );
        }

        // Progress over time (Line Chart)
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const progressOverTimeMap: Record<string, { total: number, count: number }> = {};
        attempts.forEach(a => {
            const monthStr = months[a.completedAt.getMonth()];
            if (!progressOverTimeMap[monthStr]) progressOverTimeMap[monthStr] = { total: 0, count: 0 };
            progressOverTimeMap[monthStr].total += a.score;
            progressOverTimeMap[monthStr].count += 1;
        });

        const progressOverTime = Object.keys(progressOverTimeMap).map(m => ({
            month: m,
            score: Math.round(progressOverTimeMap[m].total / progressOverTimeMap[m].count)
        }));

        if (progressOverTime.length === 0) {
            progressOverTime.push({ month: months[new Date().getMonth()], score: 0 });
        }

        // Accuracy by difficulty (Bar Chart - mocked difficulty since it's not in schema)
        const accuracyByDifficulty = [
            { difficulty: "Fácil", accuracy: attempts.length ? Math.min(100, averageScore + 10) : 0 },
            { difficulty: "Médio", accuracy: attempts.length ? averageScore : 0 },
            { difficulty: "Difícil", accuracy: attempts.length ? Math.max(0, averageScore - 15) : 0 }
        ];

        // Team speed avg (Mocked)
        const teamSpeedAvg = averageSpeed > 0 ? averageSpeed + 30 : 0;

        return {
            userId: user.id,
            name: user.name,
            email: user.email,
            department: user.department || 'Geral',
            role: user.role,
            level,
            xp,
            quizzesPassed: passedQuizzes,
            quizzesFailed: failedQuizzes,
            averageScore,
            averageSpeed, // in seconds
            recentActivity: attempts.slice(-5).map(a => ({
                id: a.id,
                title: a.quiz.title,
                score: a.score,
                passed: a.passed,
                date: a.completedAt
            })),
            performanceCategories,
            progressOverTime,
            accuracyByDifficulty,
            speedIndex: averageSpeed,
            teamSpeedAvg
        };
    }
}
