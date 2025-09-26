import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService, ModalType } from '../../services/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../../environments/environment";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {
  modalType: ModalType = null;
  payload: any = null;
  form: FormGroup | null = null;

  services: string[] = [
    'Создание сайтов',
    'Продвижение',
    'Реклама',
    'Копирайтинг'
  ];

  submitError = '';
  isSubmitting = false;

  private subs = new Subscription();

  constructor(
    private modalService: ModalService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.subs.add(
      this.modalService.modalType$.subscribe(type => {
        this.modalType = type;
        this.buildForm();
      })
    );

    this.subs.add(
      this.modalService.payload$.subscribe(p => {
        this.payload = p;
        if (this.form && this.modalType === 'order') {
          const svc = p?.service ?? '';
          this.form.get('service')?.markAsDirty();
          this.form.get('service')?.markAsTouched();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onClose() {
    this.modalService.close();
  }

  private buildForm() {
    this.submitError = '';
    this.isSubmitting = false;

    const namePattern = /^[А-ЯЁа-яё]+(?: [А-ЯЁа-яё]+)*$/;
    const phonePattern = /^\d[\d ]{10,}$/;

    if (this.modalType === 'order') {
      const defaultService = this.payload?.service ?? '';
      this.form = this.fb.group({
        service: [defaultService, [Validators.required]],
        name: ['', [Validators.required, Validators.pattern(namePattern)]],
        phone: ['', [Validators.required, Validators.pattern(phonePattern)]]
      });
    } else if (this.modalType === 'consultation') {
      this.form = this.fb.group({
        name: ['', [Validators.required, Validators.pattern(namePattern)]],
        phone: ['', [Validators.required, Validators.pattern(phonePattern)]]
      });
    } else {
      this.form = null;
    }
    this.subs.add(
      this.form?.valueChanges.subscribe(() => {
      })
    );
  }

  onSubmit() {
    if (!this.form) return;
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    const payload: any = {
      name: this.form.get('name')!.value,
      phone: this.form.get('phone')!.value
    };

    if (this.modalType === 'order') {
      payload.type = 'order';
      payload.service = this.form.get('service')!.value;
    } else {
      payload.type = 'consultation';
    }

    this.http.post(environment.api + 'requests', payload).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        if (res && res.error) {
          this.submitError = 'Произошла ошибка при отправке формы, попробуйте еще раз.';
        } else {
          this.modalService.open('success');
        }
      },
      error: () => {
        this.isSubmitting = false;
        this.submitError = 'Произошла ошибка при отправке формы, попробуйте еще раз.';
      }
    });
  }
}
