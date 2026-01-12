import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) { }

  @Post()
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizzesService.create(createQuizDto);
  }

  @Post('generate-ai')
  generateAi(@Body() body: { videoId: string }) {
    return this.quizzesService.generateAiQuiz(body.videoId);
  }

  @Post(':id/attempt')
  @UseGuards(JwtAuthGuard)
  submitAttempt(@Param('id') id: string, @Body() body: { score: number, passed: boolean }, @Req() req: any) {
    return this.quizzesService.submitAttempt(req.user.userId, id, body.score, body.passed);
  }

  @Get(':id/attempt')
  @UseGuards(JwtAuthGuard)
  getAttempt(@Param('id') id: string, @Req() req: any) {
    return this.quizzesService.getUserAttempt(req.user.userId, id);
  }

  @Get()
  findAll() {
    return this.quizzesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizzesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizzesService.update(id, updateQuizDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizzesService.remove(id);
  }
}
