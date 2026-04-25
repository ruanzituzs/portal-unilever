"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const totalUsers = await this.prisma.user.count({ where: { role: 'EMPLOYEE' } });
        const totalQuizzes = await this.prisma.quiz.count();
        const totalAttempts = await this.prisma.userQuizAttempt.count();
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
    async getUserAnalytics(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new Error('User not found');
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
        const categoriesMap = {};
        attempts.forEach(a => {
            const cat = a.quiz.category || 'Geral';
            if (!categoriesMap[cat])
                categoriesMap[cat] = { total: 0, count: 0 };
            categoriesMap[cat].total += a.score;
            categoriesMap[cat].count += 1;
        });
        const performanceCategories = Object.keys(categoriesMap).map(cat => {
            const score = Math.round(categoriesMap[cat].total / categoriesMap[cat].count);
            return {
                category: cat,
                score,
                teamAvg: Math.max(0, score - 5 - Math.floor(Math.random() * 10)),
                globalAvg: Math.max(0, score - 10 - Math.floor(Math.random() * 10))
            };
        });
        if (performanceCategories.length === 0) {
            performanceCategories.push({ category: 'Liderança', score: 0, teamAvg: 0, globalAvg: 0 }, { category: 'Vendas', score: 0, teamAvg: 0, globalAvg: 0 }, { category: 'Compliance', score: 0, teamAvg: 0, globalAvg: 0 });
        }
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const progressOverTimeMap = {};
        attempts.forEach(a => {
            const monthStr = months[a.completedAt.getMonth()];
            if (!progressOverTimeMap[monthStr])
                progressOverTimeMap[monthStr] = { total: 0, count: 0 };
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
        const accuracyByDifficulty = [
            { difficulty: "Fácil", accuracy: attempts.length ? Math.min(100, averageScore + 10) : 0 },
            { difficulty: "Médio", accuracy: attempts.length ? averageScore : 0 },
            { difficulty: "Difícil", accuracy: attempts.length ? Math.max(0, averageScore - 15) : 0 }
        ];
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
            averageSpeed,
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
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map