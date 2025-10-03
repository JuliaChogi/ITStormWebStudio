import { Component } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import {AuthService} from "../../../core";
import {DefaultResponseType, LoginResponseType} from "../../../../types";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public loginForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly _snackBar: MatSnackBar,
    private readonly router: Router
  ) { }

  public login(): void {
    if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {
      const email: string = this.loginForm.value.email;
      const password: string = this.loginForm.value.password;
      const rememberMe: boolean = !!this.loginForm.value.rememberMe;

      this.authService.login(email, password, rememberMe).subscribe({
        next: (data: LoginResponseType | DefaultResponseType) =>
          this.authService.handleAuthResponse(
            data,
            this._snackBar,
            this.router,
            'Вы успешно авторизовались'
          ),
        error: (err: HttpErrorResponse): void => {
          this._snackBar.open(err.error?.message || 'Ошибка авторизации');
        }
      });
    }
  }

}
