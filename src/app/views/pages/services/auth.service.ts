import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private casUrl = 'https://cas.isicod.net/cas';
  private serviceUrl = 'https://not-protected.isicod.net';

  constructor(private http: HttpClient, private router: Router) {}

  checkLoginStatus(service: string) {
    const authToken = localStorage.getItem('auth_token');
    if (authToken) {
      // Token exists, no need to redirect
      return;
    }
    const ticket = this.getTicketFromUrl();
    if (ticket) {
      this.validateTicket(ticket, service).subscribe((response: any) => {
        if (response.authenticationSuccess) {
          localStorage.setItem('auth_token', ticket);
        } else {
          this.redirectToLogin(service);
        }
      });
    } else {
      this.redirectToLogin(service);
    }
  }

  private getTicketFromUrl(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('ticket');
  }

  private validateTicket(ticket: string, serviceUrl: string) {
    const params = new HttpParams()
      .set('service', serviceUrl)
      .set('ticket', ticket);

    return this.http.get(`${this.casUrl}/p3/serviceValidate`, { params, responseType: 'text' })
      .pipe(map(response => this.parseCasResponse(response)));
  }

  private parseCasResponse(response: string) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(response, 'application/xml');
    const authenticationSuccess = xml.getElementsByTagName('cas:authenticationSuccess')[0];
    if (authenticationSuccess) {
      const user = authenticationSuccess.getElementsByTagName('cas:user')[0].textContent;
      const pgt = authenticationSuccess.getElementsByTagName('cas:proxyGrantingTicket')[0]?.textContent;
      console.log(pgt);
      return { authenticationSuccess: true, user, pgt };
    }
    return { authenticationSuccess: false };
  }

  private redirectToLogin(service: string) {
    localStorage.setItem('returnUrl', this.router.url);
    window.location.href = `${this.casUrl}/login?service=${service}`;
  }

  logout() {
    localStorage.removeItem('auth_token');
    window.location.href = `${this.casUrl}/logout?service=${this.serviceUrl}`;
  }
}
