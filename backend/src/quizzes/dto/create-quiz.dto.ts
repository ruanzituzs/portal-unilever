import { IsString, IsNotEmpty, IsUUID, IsNumber, IsOptional, ValidateNested, IsBoolean, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAnswerDto {
    @IsString()
    text: string;

    @IsBoolean()
    isCorrect: boolean;
}

export class CreateQuestionDto {
    @IsString()
    text: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateAnswerDto)
    answers: CreateAnswerDto[];
}

export class CreateQuizDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsUUID()
    @IsOptional()
    videoId?: string;

    @IsNumber()
    @IsOptional()
    minScore?: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateQuestionDto)
    questions: CreateQuestionDto[];
}
