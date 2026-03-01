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
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        videoId: string | null;
        minScore: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    generateAi(body: {
        videoId: string;
    }): Promise<any>;
    submitAttempt(id: string, body: {
        score: number;
        passed: boolean;
    }, req: any): Promise<{
        id: string;
        score: number;
        passed: boolean;
        timeTaken: number;
        completedAt: Date;
        userId: string;
        quizId: string;
    }>;
    getAttempt(id: string, req: any): Promise<{
        id: string;
        score: number;
        passed: boolean;
        timeTaken: number;
        completedAt: Date;
        userId: string;
        quizId: string;
    } | null>;
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
