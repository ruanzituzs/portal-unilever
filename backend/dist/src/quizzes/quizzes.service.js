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
exports.QuizzesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let QuizzesService = class QuizzesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createQuizDto) {
        console.log('Creating quiz with data:', JSON.stringify(createQuizDto, null, 2));
        return this.prisma.quiz.create({
            data: {
                title: createQuizDto.title,
                description: createQuizDto.description,
                ...(createQuizDto.videoId ? { videoId: createQuizDto.videoId } : {}),
                minScore: Number(createQuizDto.minScore),
                questions: {
                    create: (createQuizDto.questions || []).map(q => ({
                        text: q.text,
                        answers: {
                            create: (q.answers || []).map(a => ({
                                text: a.text,
                                isCorrect: Boolean(a.isCorrect)
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
    findOne(id) {
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
    update(id, updateQuizDto) {
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
    async generateAiQuiz(videoId) {
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
        }
        catch (e) {
            console.error('Failed to parse AI response', e);
            throw new Error('Failed to generate quiz from AI');
        }
    }
    async submitAttempt(userId, quizId, score, passed) {
        return this.prisma.userQuizAttempt.create({
            data: {
                userId,
                quizId,
                score,
                passed
            }
        });
    }
    async getUserAttempt(userId, quizId) {
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
    remove(id) {
        return this.prisma.quiz.delete({ where: { id } });
    }
};
exports.QuizzesService = QuizzesService;
exports.QuizzesService = QuizzesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuizzesService);
//# sourceMappingURL=quizzes.service.js.map