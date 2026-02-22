import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  error = '';
  loading = false;
  slowServerWarning = false;
  private loadingTimeout: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';
      this.slowServerWarning = false;
      this.authService.logout(); // Clear previous token to prevent role mixing

      // Show warning if Render free tier is waking up
      this.loadingTimeout = setTimeout(() => {
        if (this.loading) {
          this.slowServerWarning = true;
        }
      }, 5000);

      this.authService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          clearTimeout(this.loadingTimeout);
          const token = this.authService.getToken();

          if (res && res.error) {
            this.error = 'Credenciais inválidas. Verifique seu e-mail e senha.';
            this.loading = false;
            this.slowServerWarning = false;
            return;
          }

          if (token) {
            const decoded: any = this.authService.decodeToken(token);
            if (decoded && decoded.role === 'MANAGER') {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/dashboard']);
            }
          } else {
            this.error = 'Erro ao autenticar. Tente novamente.';
            this.loading = false;
            this.slowServerWarning = false;
          }
        },
        error: (err) => {
          clearTimeout(this.loadingTimeout);
          this.error = 'Falha no login. Verifique suas credenciais.';
          this.loading = false;
          this.slowServerWarning = false;
          console.error(err);
        }
      });
    }
  }
}
