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

  isAuthenticated(service: string) {
    const pgt = localStorage.getItem('pgt');
    if (pgt) {
      // Token exists, no need to redirect
      return;
    }
    const ticket = this.getTicketFromUrl();
    if (ticket) {
      this.validateTicket(ticket, service).subscribe((response: any) => {
        if (response.authenticationSuccess) {
          localStorage.setItem('pgt', response.pgt);
          this.router.navigate([service])
          //this.getProxyTicket(response.pgt, this.serviceUrl);
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
      .set('ticket', ticket)
      .set('pgtUrl', 'https://not-protected.isicod.net/callback');
   
    return this.http.get(`${this.casUrl}/p3/serviceValidate`, { params, responseType: 'text' })
      .pipe(map(response => this.parseCasResponse(response)));
  }

  getProxyTicket(pgt: string, targetService: string) {
    const params = new HttpParams()
      .set('service', encodeURIComponent('https://not-protected.isicod.net/protected'))
      .set('ticket', encodeURIComponent(pgt));

    this.http.get('https://cas.isicod.net/cas/proxy', { params, responseType: 'text' })
      .subscribe(response => {
        // const parser = new DOMParser();
        // const xmlDoc = parser.parseFromString(response, 'text/xml');
        // const ptElement = xmlDoc.getElementsByTagName('cas:proxyTicket')[0];

        // if (ptElement) {
        //   const proxyTicket = ptElement.textContent;
        //   console.log('Proxy Ticket:', proxyTicket);
        //   // Now you can use the proxyTicket to access the backend service
        // } else {
        //   console.error('No proxy ticket found in the response');
        // }
        console.log(response);
        
      }, error => {
        console.error('Error requesting Proxy Ticket:', error);
      });
  }

  private parseCasResponse(response: string) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(response, 'application/xml');
    const authenticationSuccess = xml.getElementsByTagName('cas:authenticationSuccess')[0];
    if (authenticationSuccess) {
      const user = authenticationSuccess.getElementsByTagName('cas:user')[0].textContent;
      const pgt = authenticationSuccess.getElementsByTagName('cas:proxyGrantingTicket')[0]?.textContent;
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
