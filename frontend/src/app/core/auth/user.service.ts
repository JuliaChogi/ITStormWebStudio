import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {DefaultResponseType, UserInfoType} from "../../../types";


@Injectable({
  providedIn: 'root'
})

export class UserService {
  private userSubject: BehaviorSubject<UserInfoType | null> = new BehaviorSubject<UserInfoType | null>(null);
  private userNameSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public userName$: Observable<string | null> = this.userNameSubject.asObservable();

  constructor(private readonly http: HttpClient) {
  }

  public getUserInfo(): void {
    this.http.get<UserInfoType | DefaultResponseType>(
      environment.api + 'users'
    ).subscribe({
      next: (data: UserInfoType | DefaultResponseType): void => {
        if ((data as DefaultResponseType).error !== undefined) {
          console.error('[UserService] Сервер вернул ошибку:', (data as DefaultResponseType).message);
          this.clearUserInfo();
          return;
        }

        const userData: UserInfoType = data as UserInfoType;
        this.setUserInfo(userData);
      },
      error: (err): void => {
        console.error('[UserService] Ошибка при получении данных пользователя:', err);
        this.clearUserInfo();
      }
    });
  }

  public clearUserInfo(): void {
    this.userSubject.next(null);
    this.userNameSubject.next(null);
  }

  private setUserInfo(user: UserInfoType): void {
    this.userSubject.next(user);
    this.userNameSubject.next(user.name);
  }
}
