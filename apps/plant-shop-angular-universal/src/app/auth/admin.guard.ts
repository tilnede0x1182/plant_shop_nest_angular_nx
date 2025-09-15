// # Importations
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// # Guard Admin
export const AdminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Vérifier si connecté + admin
  const token = auth.getToken();
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    // Décoder payload du JWT
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.admin === true) {
      return true;
    }
  } catch {
    // token invalide → retour login
  }

  router.navigate(['/']);
  return false;
};
