import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuizzesService } from '../../../core/services/quizzes.service';
import { VideosService, Video } from '../../../core/services/videos.service';

@Component({
    selector: 'app-quiz-manager',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './quiz-manager.html'
})
export class QuizManagerComponent implements OnInit {
    quizForm: FormGroup;
    videos: Video[] = [];
    creating = false;

    constructor(
        private fb: FormBuilder,
        private quizzesService: QuizzesService,
        private videosService: VideosService
    ) {
        this.quizForm = this.fb.group({
            title: ['', Validators.required],
            description: [''],
            videoId: [''], // Video selection
            minScore: [70, [Validators.required, Validators.min(0), Validators.max(100)]],
            questions: this.fb.array([])
        });
    }

    ngOnInit() {
        // Load videos for selection
        this.videosService.getVideos().subscribe(videos => {
            this.videos = videos;
        });

        this.addQuestion(); // Start with one question
    }

    get questions() {
        return this.quizForm.get('questions') as FormArray;
    }

    getAnswers(questionIndex: number) {
        return this.questions.at(questionIndex).get('answers') as FormArray;
    }

    addQuestion() {
        const question = this.fb.group({
            text: ['', Validators.required],
            answers: this.fb.array([])
        });
        this.questions.push(question);
        this.addAnswer(this.questions.length - 1);
        this.addAnswer(this.questions.length - 1);
    }

    removeQuestion(index: number) {
        this.questions.removeAt(index);
    }

    addAnswer(questionIndex: number) {
        const answer = this.fb.group({
            text: [''],
            isCorrect: [false]
        });
        this.getAnswers(questionIndex).push(answer);
    }

    removeAnswer(questionIndex: number, answerIndex: number) {
        this.getAnswers(questionIndex).removeAt(answerIndex);
    }

    generateAiQuestions() {
        const videoId = this.quizForm.get('videoId')?.value;
        if (!videoId) return;

        this.creating = true; // Use loading state
        this.quizzesService.generateAiQuiz(videoId).subscribe({
            next: (generatedQuestions) => {
                this.creating = false;
                this.questions.clear(); // Clear existing

                generatedQuestions.forEach((q: any) => {
                    const questionGroup = this.fb.group({
                        text: [q.text, Validators.required],
                        answers: this.fb.array([])
                    });

                    const answersArray = questionGroup.get('answers') as FormArray;
                    q.answers.forEach((a: any) => {
                        answersArray.push(this.fb.group({
                            text: [a.text, Validators.required],
                            isCorrect: [a.isCorrect]
                        }));
                    });

                    this.questions.push(questionGroup);
                });

                alert('Perguntas geradas com sucesso pela IA!');
            },
            error: (err) => {
                this.creating = false;
                console.error(err);
                alert('Erro ao gerar perguntas com IA.');
            }
        });
    }

    onSubmit() {
        if (this.quizForm.valid) {
            this.creating = true;

            // Clean up the payload
            const formValue = this.quizForm.value;
            const payload = {
                ...formValue,
                // Convert empty string to null/undefined so backend validation passes
                videoId: formValue.videoId ? formValue.videoId : undefined,
                // Ensure minScore is a number
                minScore: Number(formValue.minScore)
            };

            console.log('Submitting cleaned quiz data:', payload);
            this.quizzesService.createQuiz(payload).subscribe({
                next: () => {
                    this.creating = false;
                    alert('Quiz criado com sucesso!');
                    this.quizForm.reset();
                    this.questions.clear();
                    this.addQuestion();
                },
                error: (err) => {
                    this.creating = false;
                    console.error('Error creating quiz:', err);
                    alert('Erro ao criar quiz.');
                }
            });
        } else {
            alert('Preencha todo o formulário corretamente.');
        }
    }
}
