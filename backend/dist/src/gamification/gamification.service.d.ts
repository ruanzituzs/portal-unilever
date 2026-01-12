import { PrismaService } from '../prisma.service';
export interface LeaderboardEntry {
    rank: number;
    userId: string;
    name: string;
    department: string | null;
    score: number;
    quizzesTaken: number;
}
export declare class GamificationService {
    private prisma;
    constructor(prisma: PrismaService);
    getLeaderboard(limit?: number): Promise<LeaderboardEntry[]>;
    getUserStats(userId: string): Promise<LeaderboardEntry | {
        rank: null;
        userId: string;
        name: null;
        score: number;
        quizzesTaken: number;
    }>;
}
