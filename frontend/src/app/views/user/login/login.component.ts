import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../../core/auth/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { LoginResponseType } from "../../../../types/login-response.type";
import { DefaultResponseType } from "../../../../types/default-response.type";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void { }

  login(): void {
    if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      const rememberMe = !!this.loginForm.value.rememberMe;

      this.authService.login(email, password, rememberMe).subscribe({
        next: (data: LoginResponseType | DefaultResponseType) =>
          this.authService.handleAuthResponse(
            data,
            this._snackBar,
            this.router,
            'Вы успешно авторизовались'
          ),
        error: (err: HttpErrorResponse) => {
          this._snackBar.open(err.error?.message || 'Ошибка авторизации');
        }
      });
    }
  }

}
