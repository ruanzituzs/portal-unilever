import { GamificationService } from './gamification.service';
export declare class GamificationController {
    private readonly gamificationService;
    constructor(gamificationService: GamificationService);
    getLeaderboard(limit?: string): Promise<import("./gamification.service").LeaderboardEntry[]>;
    getMyStats(req: any): Promise<import("./gamification.service").LeaderboardEntry | {
        rank: null;
        userId: string;
        name: null;
        score: number;
        quizzesTaken: number;
    }>;
}
