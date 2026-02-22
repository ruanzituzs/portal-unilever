import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './register.html'
})
export class RegisterComponent {
    registerForm: FormGroup;
    loading = false;
    error = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.registerForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            accessCode: ['', Validators.required]
        });
    }

    onSubmit() {
        if (this.registerForm.valid) {
            this.loading = true;
            this.error = '';

            // Prepare data
            const userData = {
                ...this.registerForm.value,
                accessCode: this.registerForm.value.accessCode?.trim().toUpperCase()
            };

            this.authService.register(userData).subscribe({
                next: () => {
                    alert('Cadastro realizado com sucesso! Faça login para continuar.');
                    this.router.navigate(['/login']);
                },
                error: (err) => {
                    this.loading = false;
                    console.error(err);
                    if (err.error && err.error.message) {
                        this.error = err.error.message;
                    } else {
                        this.error = 'Erro ao realizar cadastro. Verifique o Código de Acesso.';
                    }
                }
            });
        }
    }
}
