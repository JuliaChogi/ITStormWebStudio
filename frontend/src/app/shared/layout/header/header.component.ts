import {Component, OnInit, OnDestroy} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, Router} from "@angular/router";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {AuthService, UserService} from "@core/auth";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private activeFragment: string | null = null;
  protected isLogged: boolean = false;
  protected userName: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
    private readonly activeRoute: ActivatedRoute
  ) {
  }

  public ngOnInit(): void {
    this.activeRoute.fragment.subscribe((fragment: string | null): void => {
      this.activeFragment = fragment;
    });
    this.authService.isLogged$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLogged: boolean): void => {
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
      .subscribe((name: string | null): void => {
        this.userName = name;
      });
  }

  protected isActive(fragment: string):boolean {
    return this.activeFragment === fragment;
  }

  protected logout(): void {
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

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
