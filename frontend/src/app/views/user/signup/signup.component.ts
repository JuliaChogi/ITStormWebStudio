import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthService} from "../../../core";
import {DefaultResponseType, LoginResponseType} from "../../../../types";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  public signupForm = this.fb.group({
    userName: ['', [Validators.required, Validators.pattern(/^[А-ЯЁ][а-яё]*(?: [А-ЯЁ][а-яё]*)*$/)]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)]],
    agree: [false, [Validators.requiredTrue]],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly _snackBar: MatSnackBar,
    private readonly router: Router
  ) {
  }

  protected signUp(): void {
    if (
      this.signupForm.valid &&
      this.signupForm.value.userName &&
      this.signupForm.value.email &&
      this.signupForm.value.password &&
      this.signupForm.value.agree
    ) {
      const userName: string = this.signupForm.value.userName;
      const email: string = this.signupForm.value.email;
      const password: string = this.signupForm.value.password;

      this.authService.signup(userName, email, password).subscribe({
        next: (data: DefaultResponseType | LoginResponseType) =>
          this.authService.handleAuthResponse(
            data,
            this._snackBar,
            this.router,
            'Вы успешно зарегистрировались'
          ),
        error: (err: HttpErrorResponse): void => {
          this._snackBar.open(err.error?.message || 'Ошибка регистрации');
        }
      });
    }
  }
}
