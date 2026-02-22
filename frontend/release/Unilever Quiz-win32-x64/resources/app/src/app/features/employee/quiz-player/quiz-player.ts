import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { QuizzesService, Quiz } from '../../../core/services/quizzes.service';

import { CertificatesService } from '../../../core/services/certificates.service';

@Component({
    selector: 'app-quiz-player',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './quiz-player.html'
})
export class QuizPlayerComponent implements OnInit {
    quiz: Quiz | null = null;
    currentQuestionIndex = 0;
    score = 0;
    correctAnswers = 0;
    finished = false;
    selectedAnswerIndex: number | null = null;

    // Video State
    hasWatchedVideo = false;
    videoCompleted = false;
    takingQuiz = false;
    canSkipVideo = !environment.production; // Only in dev

    // State for saving results
    isSaving = false;
    saveError = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private quizzesService: QuizzesService,
        private certificatesService: CertificatesService, // Inject service
        private sanitizer: DomSanitizer
    ) { }

    protected readonly Math = Math; // Make Math available in template

    ngOnInit() {
        const quizId = this.route.snapshot.paramMap.get('id');
        if (quizId) {
            // 1. Check if user already passed this quiz
            this.quizzesService.getAttempt(quizId).subscribe(attempt => {
                if (attempt && attempt.passed) {
                    this.quiz = attempt.quiz; // Should fetch quiz details if attempt doesn't have it, or separate calls
                    // Actually getAttempt returns attempt. We need quiz too.
                    // Let's load quiz first.
                }
            });

            this.quizzesService.getQuiz(quizId).subscribe(quiz => {
                this.quiz = quiz;

                // Check attempt
                this.quizzesService.getAttempt(quizId).subscribe(attempt => {
                    if (attempt && attempt.passed) {
                        this.finished = true;
                        this.score = attempt.score;
                        return;
                    }

                    // If not finished, check video
                    if (!quiz.video) {
                        this.takingQuiz = true;
                    }
                });
            });
        }
    }

    // ... existing video methods ...

    // ... existing code ...

    // Video Helper Methods
    getVideoUrl(url: string): SafeResourceUrl {
        if (!url) return '';
        if (url.startsWith('http')) {
            return this.sanitizer.bypassSecurityTrustResourceUrl(url);
        }
        const baseUrl = environment.apiUrl.endsWith('/') ? environment.apiUrl.slice(0, -1) : environment.apiUrl;
        const videoPath = url.startsWith('/') ? url : `/${url}`;
        return this.sanitizer.bypassSecurityTrustResourceUrl(`${baseUrl}${videoPath}`);
    }

    onVideoEnded() {
        this.videoCompleted = true;
    }

    skipVideo() {
        this.videoCompleted = true;
    }

    startQuiz() {
        this.hasWatchedVideo = true;
        this.takingQuiz = true;
    }

    selectAnswer(index: number) {
        this.selectedAnswerIndex = index;
    }

    finishQuiz() {
        if (!this.quiz) return;

        this.finished = true;

        // Calculate Score: 100 points per correct answer
        this.score = this.correctAnswers * 100;

        // Calculate Passing: Based on percentage of correct answers
        const percentage = (this.correctAnswers / this.quiz.questions!.length) * 100;
        const passed = percentage >= this.quiz.minScore;

        this.quizzesService.submitAttempt(this.quiz.id, this.score, passed).subscribe({
            next: (res) => console.log('Attempt saved', res),
            error: (err) => console.error('Failed to save attempt', err)
        });
    }

    // ... 

    retryQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.finished = false;
        this.takingQuiz = true;
        this.selectedAnswerIndex = null;
        this.isSaving = false;
        this.saveError = false;
    }

    // ...

    nextQuestion() {
        if (this.selectedAnswerIndex === null || !this.quiz || !this.quiz.questions) return;

        const currentQuestion = this.quiz.questions[this.currentQuestionIndex];
        if (currentQuestion.answers[this.selectedAnswerIndex].isCorrect) {
            this.correctAnswers++;
        }

        this.selectedAnswerIndex = null;
        if (this.currentQuestionIndex < this.quiz.questions.length - 1) {
            this.currentQuestionIndex++;
        } else {
            this.finishQuiz();
        }
    }

    downloadCertificate() {
        if (!this.quiz) return;
        if (this.isSaving) {
            alert('Aguarde, salvando seu resultado...');
            return;
        }
        if (this.saveError) {
            alert('Erro ao salvar resultado. Tente finalizar novamente.');
            return;
        }

        this.certificatesService.downloadCertificate(this.quiz.id).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Certificado-${this.quiz?.title}.pdf`;
                link.click();
                window.URL.revokeObjectURL(url);
            },
            error: (err) => {
                console.error('Download failed', err);
                alert('Erro ao baixar certificado. Verifique se você atingiu a nota mínima.');
            }
        });
    }

    backToDashboard() {
        this.router.navigate(['/dashboard']);
    }
}
