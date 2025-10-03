import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

export type ModalType = 'consultation' | 'order' | 'success' | null;

@Injectable({
  providedIn: 'root'
})


export class ModalService {
  private modalTypeSubject = new BehaviorSubject<ModalType>(null);
  public modalType$ = this.modalTypeSubject.asObservable();
  private payloadSubject = new BehaviorSubject<any>(null);
  public payload$ = this.payloadSubject.asObservable();

  public open(type: ModalType, payload?: any): void {
    this.payloadSubject.next(payload ?? null);
    this.modalTypeSubject.next(type);
  }

  public close(): void {
    this.modalTypeSubject.next(null);
    this.payloadSubject.next(null);
  }

  constructor() {
  }
}
