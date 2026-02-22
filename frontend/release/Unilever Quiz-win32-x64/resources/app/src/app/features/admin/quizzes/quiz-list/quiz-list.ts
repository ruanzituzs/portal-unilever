import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QuizzesService, Quiz } from '../../../../core/services/quizzes.service';

@Component({
    selector: 'app-quiz-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './quiz-list.html'
})
export class QuizListComponent implements OnInit {
    quizzes: Quiz[] = [];
    loading = true;

    constructor(private quizzesService: QuizzesService) { }

    ngOnInit() {
        this.loadQuizzes();
    }

    loadQuizzes() {
        this.loading = true;
        this.quizzesService.getQuizzes().subscribe({
            next: (data) => {
                this.quizzes = data;
                this.loading = false;
            },
            error: (err) => {
                console.error(err);
                this.loading = false;
            }
        });
    }

    deleteQuiz(id: string) {
        if (confirm('Tem certeza que deseja excluir este quiz? Esta ação não pode ser desfeita.')) {
            this.quizzesService.deleteQuiz(id).subscribe({
                next: () => {
                    this.quizzes = this.quizzes.filter(q => q.id !== id);
                    alert('Quiz excluído com sucesso.');
                },
                error: (err) => {
                    console.error(err);
                    alert('Erro ao excluir quiz.');
                }
            });
        }
    }
}
