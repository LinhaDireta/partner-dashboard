import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/do';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  check(): boolean {
    return localStorage.getItem('user') ? true : false;
  }

  login(credentials: {email: string, password: string}): Observable<boolean> {
    return this.http.post<any>(environment.api_url + '/police-station/login', credentials)
    .do(data => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', btoa(JSON.stringify(data.user)));
    });
  }

  logout(): void {
    this.http.get(environment.api_url + '/auth/logout').subscribe((response) => {
      localStorage.clear();
      this.router.navigate(['login']);
    });
  }

  getUser(): User {
    return localStorage.getItem('user') ? JSON.parse(atob(localStorage.getItem('user'))) : null;
  }

  setUser(): Promise<boolean> {
    return this.http.get<any>(environment.api_url + '/auth/me').toPromise()
      .then(data => {
        if (data.user) {
          localStorage.setItem('user', btoa(JSON.stringify(data.user)));
          return true;
        }
        return false;
      });
  }
}
