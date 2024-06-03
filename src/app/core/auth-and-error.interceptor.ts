import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../views/pages/services/auth.service';

@Injectable()
export class AuthAndErrorInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService
    ) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

        if (this.authService.isAuthenticated()) {
            const accessToken = this.authService.getJwt();
            if (accessToken) {
                request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + accessToken) });
            }
        }
        return next.handle(request).pipe(
            tap({
                error: (error: HttpErrorResponse) => {
                    if (error.status == 401 || error.status == 403) {
                        this.authService.generateJwt();
                    }
                },
            })
        );
    }
}
