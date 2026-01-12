import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('gamification')
@UseGuards(JwtAuthGuard)
export class GamificationController {
    constructor(private readonly gamificationService: GamificationService) { }

    @Get('leaderboard')
    getLeaderboard(@Query('limit') limit?: string) {
        return this.gamificationService.getLeaderboard(limit ? Number(limit) : 10);
    }

    @Get('my-stats')
    getMyStats(@Req() req: any) {
        return this.gamificationService.getUserStats(req.user.userId);
    }
}
