import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const token = authService.getToken();
    if (!token) {
        router.navigate(['/login']);
        return false;
    }

    // Optional: Check expiration
    try {
        const decoded: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            authService.logout();
            router.navigate(['/login']);
            return false;
        }

        // Role check
        const requiredRole = route.data['role'];
        if (requiredRole && decoded.role !== requiredRole) {
            // Redirect to appropriate dashboard if logged in but wrong role
            if (decoded.role === 'MANAGER') router.navigate(['/admin']);
            else router.navigate(['/dashboard']);
            return false;
        }

    } catch (e) {
        authService.logout();
        router.navigate(['/login']);
        return false;
    }

    return true;
};
