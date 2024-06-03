import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private casUrl = 'https://cas.isicod.net/cas';
  private service = window.location.origin + window.location.pathname;

  constructor(private http: HttpClient, private router: Router) {}

  isAuthenticated() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      return true;
    }
    else {
      return false;
    }
  }

  generateJwt() {
    const params = new URLSearchParams(window.location.search);
    const ticket = params.get('ticket');

    if (ticket) {
      this.http.get<any>(`http://localhost:8900/api/v1/auth/jwt?ticket=${ticket}&service=${this.service}`)
      .subscribe(response => {
        localStorage.setItem('jwt', response.jwt);
        const parsedUrl = new URL(this.service)
        parsedUrl.searchParams.delete('ticket');
        console.log(parsedUrl);
        
        this.router.navigate([parsedUrl]);
      });

    } else {
      this.redirectToLogin();
    }
  }

  getJwt() {
    return localStorage.getItem('jwt');
  }

  private redirectToLogin() {
    window.location.href = `${this.casUrl}/login?service=${this.service}`;
  }

  logout() {
    localStorage.removeItem('jwt');
    window.location.href = `${this.casUrl}/logout?service=${this.service}`;
  }
}
