import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  submitted = false;
  errorCredentials = false;

  email = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

  password = new FormControl('', [
    Validators.required
  ]);

  remember_me = new FormControl('', []);

  formGroupLogin: FormGroup = this.builder.group({
    email: this.email,
    password: this.password,
    remember_me: this.remember_me
  });

  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSubmitLogin() {
    console.log("onSubmitLogin");

    if ( this.formGroupLogin.valid ) {
      this.submitted = true;
      this.authService.login(this.formGroupLogin.value).subscribe(
        (data) => {
          console.log('data:', data);
          this.router.navigate(['home']);
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status === 401) {
            this.errorCredentials = true;
            this.submitted = false;
            setTimeout(() => {
              this.errorCredentials = false;
            }, 888000);
          }
        }
      );

    } else {
      this.errorCredentials = true;
      this.submitted = false;
      setTimeout(() => {
        this.errorCredentials = false;
      }, 88000);
    }
    }

}
