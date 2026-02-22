import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { AdminDashboardComponent } from './features/admin/dashboard/dashboard';
import { EmployeeDashboard } from './features/employee/dashboard/dashboard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'admin',
        component: AdminDashboardComponent,
        canActivate: [authGuard],
        data: { role: 'MANAGER' }
    },
    {
        path: 'admin/videos',
        loadComponent: () => import('./features/admin/videos/video-manager').then(m => m.VideoManagerComponent),
        canActivate: [authGuard],
        data: { role: 'MANAGER' }
    },
    {
        path: 'admin/quizzes', // List view
        loadComponent: () => import('./features/admin/quizzes/quiz-list/quiz-list').then(m => m.QuizListComponent),
        canActivate: [authGuard],
        data: { role: 'MANAGER' }
    },
    {
        path: 'admin/quizzes/create',
        loadComponent: () => import('./features/admin/quizzes/quiz-manager').then(m => m.QuizManagerComponent),
        canActivate: [authGuard],
        data: { role: 'MANAGER' }
    },
    {
        path: 'admin/quizzes/criar',
        loadComponent: () => import('./features/admin/quizzes/quiz-manager').then(m => m.QuizManagerComponent),
        canActivate: [authGuard],
        data: { role: 'MANAGER' }
    },
    {
        path: 'admin/users',
        loadComponent: () => import('./features/admin/users/user-manager').then(m => m.UserManagerComponent),
        canActivate: [authGuard],
        data: { role: 'MANAGER' }
    },
    {
        path: 'quiz/:id',
        loadComponent: () => import('./features/employee/quiz-player/quiz-player').then(m => m.QuizPlayerComponent),
        canActivate: [authGuard]
    },
    {
        path: 'dashboard',
        component: EmployeeDashboard,
        canActivate: [authGuard],
        data: { role: 'EMPLOYEE' }
    },
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];
