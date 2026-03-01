import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { PrismaService } from '../prisma.service';
export declare class QuizzesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createQuizDto: CreateQuizDto): import(".prisma/client").Prisma.Prisma__QuizClient<{
        questions: ({
            answers: {
                id: string;
                text: string;
                isCorrect: boolean;
                questionId: string;
            }[];
        } & {
            id: string;
            text: string;
            quizId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        videoId: string | null;
        minScore: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        video: {
            id: string;
            createdAt: Date;
            title: string;
            description: string | null;
            url: string;
            duration: number;
        } | null;
        questions: {
            id: string;
            text: string;
            quizId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        videoId: string | null;
        minScore: number;
    })[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__QuizClient<({
        video: {
            id: string;
            createdAt: Date;
            title: string;
            description: string | null;
            url: string;
            duration: number;
        } | null;
        questions: ({
            answers: {
                id: string;
                text: string;
                isCorrect: boolean;
                questionId: string;
            }[];
        } & {
            id: string;
            text: string;
            quizId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        videoId: string | null;
        minScore: number;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, updateQuizDto: UpdateQuizDto): import(".prisma/client").Prisma.Prisma__QuizClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        videoId: string | null;
        minScore: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    generateAiQuiz(videoId: string): Promise<any>;
    submitAttempt(userId: string, quizId: string, score: number, passed: boolean): Promise<{
        id: string;
        score: number;
        passed: boolean;
        timeTaken: number;
        completedAt: Date;
        userId: string;
        quizId: string;
    }>;
    getUserAttempt(userId: string, quizId: string): Promise<{
        id: string;
        score: number;
        passed: boolean;
        timeTaken: number;
        completedAt: Date;
        userId: string;
        quizId: string;
    } | null>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__QuizClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        videoId: string | null;
        minScore: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
