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
      throw new Error('Vídeo não encontrado');
    }

    const OpenAI = require('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `
      Crie um quiz com 5 perguntas de múltipla escolha baseadas nos seguintes metadados de vídeo:
      Título: ${video.title}
      Descrição: ${video.description}

      IMPORTANTE: As perguntas e respostas devem estar em PORTUGUÊS (Brasil).

      A saída deve ser um array JSON válido de objetos com a seguinte estrutura:
      [
        {
          "text": "Texto da pergunta aqui?",
          "answers": [
            { "text": "Resposta correta", "isCorrect": true },
            { "text": "Resposta errada 1", "isCorrect": false },
            { "text": "Resposta errada 2", "isCorrect": false },
            { "text": "Resposta errada 3", "isCorrect": false }
          ]
        }
      ]
      
      Retorne APENAS o array JSON, sem markdown ou blocos de código.
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
      throw new Error('Falha ao gerar quiz com IA');
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
