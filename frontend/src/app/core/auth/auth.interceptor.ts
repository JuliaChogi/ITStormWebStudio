import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, finalize, switchMap} from 'rxjs/operators';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {LoaderService} from "../../shared";
import {DefaultResponseType, LoginResponseType} from "../../../types";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly loaderService: LoaderService
  ) {
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.show();
    const tokens: { accessToken: string | null; refreshToken: string | null } = this.authService.getTokens();
    const authReq: HttpRequest<any> = tokens?.accessToken
      ? req.clone({
        setHeaders: {
          'x-auth': tokens.accessToken
        }
      })
      : req;
    return next.handle(authReq).pipe(
      catchError(error => {
        if (error.status === 401 && !req.url.includes('/login') && !req.url.includes('/refresh')) {
          return this.handle401Error(authReq, next);
        }
        return throwError(() => error);
      }),
      finalize(() => this.loaderService.hide())
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.refresh().pipe(
      switchMap((result: DefaultResponseType | LoginResponseType) => {
        let error: string = '';
        if ((result as DefaultResponseType).error) {
          error = (result as DefaultResponseType).message;
        }

        const refreshResult: LoginResponseType = result as LoginResponseType;
        if (!refreshResult.accessToken || !refreshResult.refreshToken || !refreshResult.userId) {
          error = error || 'Ошибка авторизации';
        }
        if (error) return throwError(() => new Error(error));
        this.authService.setTokens(refreshResult.accessToken, refreshResult.refreshToken);
        const newReq: HttpRequest<any> = req.clone({
          setHeaders: {
            'x-auth': refreshResult.accessToken
          }
        });
        return next.handle(newReq);
      }),
      catchError(error => {
        this.authService.removeTokens();
        this.router.navigate(['/']);
        return throwError(() => error);
      })
    );
  }
}
