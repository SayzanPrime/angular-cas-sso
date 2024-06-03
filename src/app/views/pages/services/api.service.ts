import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:8900/api/v1/';

  constructor(private http: HttpClient) { }

  fetchProtectedData(): Observable<any> {
    return this.http.get(this.apiUrl + 'protected');
  }

  fetchNotProtectedData(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'not-protected');
  }
}
