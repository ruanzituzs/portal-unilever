import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VideosModule } from './videos/videos.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { GamificationModule } from './gamification/gamification.module';
import { CertificatesModule } from './certificates/certificates.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, VideosModule, QuizzesModule, GamificationModule, CertificatesModule, AnalyticsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
