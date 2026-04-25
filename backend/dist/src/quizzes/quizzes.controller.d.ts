import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
export declare class QuizzesController {
    private readonly quizzesService;
    constructor(quizzesService: QuizzesService);
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
        title: string;
        description: string | null;
        category: string | null;
        minScore: number;
        createdAt: Date;
        updatedAt: Date;
        videoId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    generateAi(body: {
        videoId: string;
    }): Promise<any>;
    submitAttempt(id: string, body: {
        score: number;
        passed: boolean;
        timeTaken?: number;
        answers?: any[];
    }, req: any): Promise<{
        id: string;
        quizId: string;
        score: number;
        passed: boolean;
        timeTaken: number;
        completedAt: Date;
        userId: string;
    }>;
    getAttempt(id: string, req: any): Promise<{
        id: string;
        quizId: string;
        score: number;
        passed: boolean;
        timeTaken: number;
        completedAt: Date;
        userId: string;
    } | null>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        video: {
            id: string;
            title: string;
            description: string | null;
            createdAt: Date;
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
        title: string;
        description: string | null;
        category: string | null;
        minScore: number;
        createdAt: Date;
        updatedAt: Date;
        videoId: string | null;
    })[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__QuizClient<({
        video: {
            id: string;
            title: string;
            description: string | null;
            createdAt: Date;
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
        title: string;
        description: string | null;
        category: string | null;
        minScore: number;
        createdAt: Date;
        updatedAt: Date;
        videoId: string | null;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, updateQuizDto: UpdateQuizDto): import(".prisma/client").Prisma.Prisma__QuizClient<{
        id: string;
        title: string;
        description: string | null;
        category: string | null;
        minScore: number;
        createdAt: Date;
        updatedAt: Date;
        videoId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__QuizClient<{
        id: string;
        title: string;
        description: string | null;
        category: string | null;
        minScore: number;
        createdAt: Date;
        updatedAt: Date;
        videoId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
