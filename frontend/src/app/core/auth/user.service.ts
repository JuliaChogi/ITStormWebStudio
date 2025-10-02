import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {environment} from '../../../environments/environment';
import {DefaultResponseType, UserInfoType} from "../../../types";


@Injectable({
  providedIn: 'root'
})

export class UserService {
  private userSubject = new BehaviorSubject<UserInfoType | null>(null);
  private userNameSubject = new BehaviorSubject<string | null>(null);
  public userName$ = this.userNameSubject.asObservable();

  constructor(private http: HttpClient) {
  }

  getUserInfo(): void {
    this.http.get<UserInfoType | DefaultResponseType>(
      environment.api + 'users'
    ).subscribe({
      next: (data) => {
        if ((data as DefaultResponseType).error !== undefined) {
          console.error('[UserService] Сервер вернул ошибку:', (data as DefaultResponseType).message);
          this.clearUserInfo();
          return;
        }

        const userData = data as UserInfoType;
        this.setUserInfo(userData);
      },
      error: (err) => {
        console.error('[UserService] Ошибка при получении данных пользователя:', err);
        this.clearUserInfo();
      }
    });
  }

  clearUserInfo() {
    this.userSubject.next(null);
    this.userNameSubject.next(null);
  }

  setUserInfo(user: UserInfoType) {
    this.userSubject.next(user);
    this.userNameSubject.next(user.name);
  }
}
