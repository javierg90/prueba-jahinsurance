import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 500 && localStorage.getItem('refresh_token')) {
        return auth.refresh().pipe(
          switchMap(() => {
            const newToken = auth.getToken();
            const retry = newToken ? req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }) : req;
            return next(retry);
          })
        );
      }
      return throwError(() => err);
    })
  );
};
