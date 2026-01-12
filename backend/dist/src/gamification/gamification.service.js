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
exports.GamificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let GamificationService = class GamificationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getLeaderboard(limit = 10) {
        const allUsers = await this.prisma.user.findMany({
            where: { role: 'EMPLOYEE' }
        });
        const attempts = await this.prisma.userQuizAttempt.findMany();
        const userScores = new Map();
        attempts.forEach(attempt => {
            const current = userScores.get(attempt.userId) || { score: 0, quizzes: 0 };
            current.score += attempt.score;
            current.quizzes += 1;
            userScores.set(attempt.userId, current);
        });
        const leaderboard = allUsers.map(user => {
            const stats = userScores.get(user.id) || { score: 0, quizzes: 0 };
            return {
                rank: 0,
                userId: user.id,
                name: user.name,
                department: user.department,
                score: stats.score,
                quizzesTaken: stats.quizzes
            };
        });
        leaderboard.sort((a, b) => {
            if (b.score !== a.score)
                return b.score - a.score;
            return a.name.localeCompare(b.name);
        });
        return leaderboard.slice(0, limit).map((entry, index) => ({
            ...entry,
            rank: index + 1
        }));
    }
    async getUserStats(userId) {
        const leaderboard = await this.getLeaderboard(1000);
        const userRank = leaderboard.find(e => e.userId === userId);
        if (userRank) {
            return userRank;
        }
        return {
            rank: null,
            userId,
            name: null,
            score: 0,
            quizzesTaken: 0
        };
    }
};
exports.GamificationService = GamificationService;
exports.GamificationService = GamificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GamificationService);
//# sourceMappingURL=gamification.service.js.map