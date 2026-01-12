import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

export interface LeaderboardEntry {
    rank: number;
    userId: string;
    name: string;
    department: string | null;
    score: number;
    quizzesTaken: number;
}

@Injectable()
export class GamificationService {
    constructor(private prisma: PrismaService) { }

    async getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
        // 1. Fetch all users
        const allUsers = await this.prisma.user.findMany({
            where: { role: 'EMPLOYEE' } // Only show employees in ranking
        });

        // 2. Fetch all attempts
        const attempts = await this.prisma.userQuizAttempt.findMany();

        // 3. Calculate scores per user
        const userScores = new Map<string, { score: number; quizzes: number }>();

        attempts.forEach(attempt => {
            const current = userScores.get(attempt.userId) || { score: 0, quizzes: 0 };
            current.score += attempt.score;
            current.quizzes += 1;
            userScores.set(attempt.userId, current);
        });

        // 4. Map users to leaderboard entries
        const leaderboard = allUsers.map(user => {
            const stats = userScores.get(user.id) || { score: 0, quizzes: 0 };
            return {
                rank: 0, // Assigned after sort
                userId: user.id,
                name: user.name,
                department: user.department,
                score: stats.score,
                quizzesTaken: stats.quizzes
            };
        });

        // 5. Sort by score desc, then name asc
        leaderboard.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return a.name.localeCompare(b.name);
        });

        // 6. Assign ranks and slice
        return leaderboard.slice(0, limit).map((entry, index) => ({
            ...entry,
            rank: index + 1
        }));
    }

    async getUserStats(userId: string) {
        const leaderboard = await this.getLeaderboard(1000); // Get full list to find rank
        const userRank = leaderboard.find(e => e.userId === userId);

        if (userRank) {
            return userRank;
        }

        // If user has no attempts yet
        return {
            rank: null,
            userId,
            name: null,
            score: 0,
            quizzesTaken: 0
        };
    }
}
