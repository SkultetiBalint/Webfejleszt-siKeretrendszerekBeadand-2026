import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

/**
 * Globális HTTP error interceptor.
 *
 * Egységesen kezeli a backend felől érkező hibákat:
 * - 4xx / 5xx státuszkódoknál user-friendly toast üzenet jelenik meg
 * - hálózati hiba (status 0) esetén "Nem sikerült elérni a szervert" üzenet
 * - továbbdobja a hibát, hogy a komponensek is reagálni tudjanak
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      let userMessage: string;

      if (err.status === 0) {
        userMessage =
          'Nem sikerült elérni a szervert. Indítsd el a json-server-t (npm run server).';
      } else if (err.status === 404) {
        userMessage = 'A keresett erőforrás nem található.';
      } else if (err.status >= 500) {
        userMessage = 'Szerverhiba történt, próbáld újra később.';
      } else if (err.status === 400) {
        userMessage = 'Érvénytelen adatok a kérésben.';
      } else {
        userMessage = `Hiba történt (${err.status}).`;
      }

      // GET kérés hibáit ne dupla-toaszteld olyan komponensekben, ahol már
      // saját feedback van; itt mindig megjelenítjük a hiba jellegéről, de
      // a komponensek el tudják fogni és lokálisan is kezelni.
      toast.error(userMessage);

      return throwError(() => err);
    })
  );
};
