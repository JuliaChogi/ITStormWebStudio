import {Component, OnInit, OnDestroy} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {UserService} from "../../../core/auth/user.service";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLogged = false;
  userName: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.authService.isLogged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLogged => {
        this.isLogged = isLogged;

        if (!isLogged) {
          this.userName = null;
          this.userService.clearUserInfo();
          return;
        }

        if (!this.userName) {
          this.userService.getUserInfo();
        }
      });

    this.userService.userName$
      .pipe(takeUntil(this.destroy$))
      .subscribe(name => {
        this.userName = name;
      });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.doLogout(),
      error: () => this.doLogout()
    });
  }

  private doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this.userService.clearUserInfo();
    this.snackBar.open('Вы вышли из системы', 'Закрыть', { duration: 3000 });
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
