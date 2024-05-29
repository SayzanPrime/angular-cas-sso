import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).pipe(
            catchError(
                (error: HttpErrorResponse) => {

                    if ((error.status === 200 && error.url && error.url.includes('/cas/login')) || error.status === 401 || error.status === 403) {
                        window.location.href = 'https://cas.isicod.net/cas/login?service=http%3A%2F%2Flocalhost%3A8900%2Flogin%2Fcas';
                    }

                    return throwError(error);
                }
            )
        );
    }
}