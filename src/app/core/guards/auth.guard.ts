import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

/**
 * authGuard — bejelentkezett felhasználók engedélyezése.
 * Ha nincs login, átirányít `/login`-ra (returnUrl query paraméterrel).
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  if (auth.isLoggedIn()) return true;

  toast.info('A folytatáshoz be kell jelentkezned.');
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

/**
 * adminGuard — csak admin szerepkörű felhasználóknak.
 * Ha be van jelentkezve, de nem admin: 403, vissza a kezdőlapra.
 * Ha nincs bejelentkezve: ugyanaz mint az authGuard.
 */
export const adminGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  if (!auth.isLoggedIn()) {
    toast.info('Bejelentkezés szükséges.');
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  if (!auth.isAdmin()) {
    toast.error('Ehhez a funkcióhoz admin jogosultság kell.');
    router.navigate(['/']);
    return false;
  }
  return true;
};
