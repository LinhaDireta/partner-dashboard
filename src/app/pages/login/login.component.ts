import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  submitted = false;
  errorCredentials = false;
  returnUrl: string;

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
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'home';
  }

  onSubmitLogin() {
    if ( this.formGroupLogin.valid ) {
      this.submitted = true;
      this.authService.login(this.formGroupLogin.value).subscribe(
        (user) => {
          this.router.navigate([this.returnUrl]);
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
