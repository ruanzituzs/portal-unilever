import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class QuizzesService {
  constructor(private prisma: PrismaService) { }

  create(createQuizDto: CreateQuizDto) {
    console.log('Creating quiz with data:', JSON.stringify(createQuizDto, null, 2));

    return this.prisma.quiz.create({
      data: {
        title: createQuizDto.title,
        description: createQuizDto.description,
        ...(createQuizDto.videoId ? { videoId: createQuizDto.videoId } : {}),
        minScore: Number(createQuizDto.minScore), // Ensure number
        questions: {
          create: (createQuizDto.questions || []).map(q => ({
            text: q.text,
            answers: {
              create: (q.answers || []).map(a => ({
                text: a.text,
                isCorrect: Boolean(a.isCorrect) // Ensure boolean
              }))
            }
          }))
        }
      },
      include: {
        questions: {
          include: { answers: true }
        }
      }
    });
  }

  findAll() {
    return this.prisma.quiz.findMany({
      include: {
        video: true,
        questions: true
      }
    });
  }

  findOne(id: string) {
    return this.prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          include: { answers: true }
        },
        video: true
      }
    });
  }

  update(id: string, updateQuizDto: UpdateQuizDto) {
    // Updating nested relations is complex, for MVP we might focus on updating base fields
    // or deleting and recreating questions. For now, simple update.
    return this.prisma.quiz.update({
      where: { id },
      data: {
        title: updateQuizDto.title,
        description: updateQuizDto.description,
        minScore: updateQuizDto.minScore,
        videoId: updateQuizDto.videoId
      }
    });
  }

  async generateAiQuiz(videoId: string) {
    const video = await this.prisma.video.findUnique({ where: { id: videoId } });
    if (!video) {
      throw new Error('Video not found');
    }

    const OpenAI = require('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `
      Create a quiz with 5 multiple choice questions based on the following video metadata:
      Title: ${video.title}
      Description: ${video.description}

      The output must be a valid JSON array of objects with the following structure:
      [
        {
          "text": "Question text here?",
          "answers": [
            { "text": "Correct answer", "isCorrect": true },
            { "text": "Wrong answer 1", "isCorrect": false },
            { "text": "Wrong answer 2", "isCorrect": false },
            { "text": "Wrong answer 3", "isCorrect": false }
          ]
        }
      ]
      
      Only return the JSON array, no markdown or code blocks.
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4o-mini',
    });

    try {
      const content = completion.choices[0].message.content.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse AI response', e);
      throw new Error('Failed to generate quiz from AI');
    }
  }

  async submitAttempt(userId: string, quizId: string, score: number, passed: boolean) {
    // Check if attempt exists, if so, update if higher score? Or just log new one.
    // For now, let's keep it simple: Create new attempt.
    return this.prisma.userQuizAttempt.create({
      data: {
        userId,
        quizId,
        score,
        passed
      }
    });
  }

  async getUserAttempt(userId: string, quizId: string) {
    // Get the best attempt? Or latest? Let's get the best (passed) one if exists.
    return this.prisma.userQuizAttempt.findFirst({
      where: {
        userId,
        quizId,
        passed: true
      },
      orderBy: {
        score: 'desc'
      }
    });
  }

  remove(id: string) {
    return this.prisma.quiz.delete({ where: { id } });
  }
}
