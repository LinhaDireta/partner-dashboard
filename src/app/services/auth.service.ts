import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/do';
import { User } from '../interfaces/user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  check(): boolean {
    return localStorage.getItem('currentUser') ? true : false;
  }

  login(credentials: {email: string, password: string}): Observable<User> {
    return this.http.post<User>(environment.api_url + '/police-station/login', credentials)
      .pipe(
        map(data => {
          if (data) {
            const user = this.formatedUser(data);
            localStorage.setItem('currentUser', btoa(JSON.stringify(user)));
            return <User>user;
          } else {
            return null;
          }

        })
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['login']);
  }

  getUser(): User {
    return localStorage.getItem('currentUser') ? JSON.parse(atob(localStorage.getItem('currentUser'))) : null;
  }

  refreshToken() : Observable<User> {
    let currentUser = this.getUser();
    let token = currentUser.token;
 
    return this.http.post<User>(`${environment.api_url}/auth/refresh`, { 'token': token })
      .pipe(
        map(data => {
 
          if (data && data.token) {
            const user = this.formatedUser(data);
            localStorage.setItem('currentUser', btoa(JSON.stringify(user)));
            return <User>user;
          } else {
            return null;
          }
 
      }));
  }


  getAuthToken() : string {
    let currentUser = this.getUser();
 
    if(currentUser != null) {
      return currentUser.token;
    }
 
    return '';
  }

  formatedUser(data) {
    return {
      token: data.token,
      id: data.user.id,
      first_name: data.user.first_name,
      last_name: data.user.last_name,
      phone_number: data.user.phone_number,
      email: data.user.email,
      police_station_id: data.user.police_station_id
    }
  }

}
