import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

export type ModalType = 'consultation' | 'order' | 'success' | null;

@Injectable({
  providedIn: 'root'
})


export class ModalService {
  private modalTypeSubject = new BehaviorSubject<ModalType>(null);
  modalType$ = this.modalTypeSubject.asObservable();
  private payloadSubject = new BehaviorSubject<any>(null);
  payload$ = this.payloadSubject.asObservable();
  open(type: ModalType, payload?: any) {
    this.payloadSubject.next(payload ?? null);
    this.modalTypeSubject.next(type);
  }

  close() {
    this.modalTypeSubject.next(null);
    this.payloadSubject.next(null);
  }
  constructor() { }
}
