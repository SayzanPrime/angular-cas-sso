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

  generateJwt(): Promise<boolean> {
    const params = new URLSearchParams(window.location.search);
    const ticket = params.get('ticket');

    if (ticket) {
      return this.http.get<any>(`http://localhost:8900/api/v1/auth/jwt?ticket=${ticket}&service=${this.service}`)
        .toPromise()
        .then(response => {
          localStorage.setItem('jwt', response.jwt);
          localStorage.setItem('profil', response.profil);

          const parsedUrl = new URL(this.service);
          this.router.navigate([parsedUrl.pathname.toString()]);
          return true;
        })
        .catch(error => {
          console.error('Error fetching JWT:', error);
          return false;
        });
    } else {
      this.redirectToLogin();
      return Promise.resolve(false);
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
