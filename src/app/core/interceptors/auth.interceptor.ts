import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Authorization interceptor.
 *
 * Minden kimenő HTTP kéréshez hozzáfűzi a `Authorization: Bearer <jwt>`
 * fejlécet, ha a felhasználó be van jelentkezve. A login és register
 * kérésekhez nem teszi (mert ott még nincs token).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token();

  // Kihagyjuk a /login és /register végpontokat
  const isAuthEndpoint =
    req.url.endsWith('/login') || req.url.endsWith('/register');

  if (token && !isAuthEndpoint) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
  }
  return next(req);
};
