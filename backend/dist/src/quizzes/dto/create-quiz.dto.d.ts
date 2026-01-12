export declare class CreateAnswerDto {
    text: string;
    isCorrect: boolean;
}
export declare class CreateQuestionDto {
    text: string;
    answers: CreateAnswerDto[];
}
export declare class CreateQuizDto {
    title: string;
    description?: string;
    videoId?: string;
    minScore?: number;
    questions: CreateQuestionDto[];
}
