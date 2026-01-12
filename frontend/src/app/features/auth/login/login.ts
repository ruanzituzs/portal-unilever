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
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          const token = this.authService.getToken();
          if (token) {
            const decoded: any = this.authService.decodeToken(token);
            if (decoded && decoded.role === 'MANAGER') {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/dashboard']);
            }
          }
        },
        error: (err) => {
          this.error = 'Falha no login. Verifique suas credenciais.';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }
}
