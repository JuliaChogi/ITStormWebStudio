import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../../../environments/environment";
import {ModalService, ModalType} from "../../services";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {
  protected modalType: ModalType = null;
  private payload: any = null;
  protected form: FormGroup | null = null;

  protected services: string[] = [
    'Создание сайтов',
    'Продвижение',
    'Реклама',
    'Копирайтинг'
  ];

  protected submitError: string = '';
  protected isSubmitting: boolean = false;

  private subs: Subscription = new Subscription();

  constructor(
    private modalService: ModalService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
  }

  public ngOnInit() {
    this.subs.add(
      this.modalService.modalType$.subscribe((type: "consultation" | "order" | "success" | null): void => {
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

  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  protected onClose(): void {
    this.modalService.close();
  }

  private buildForm(): void {
    this.submitError = '';
    this.isSubmitting = false;

    const namePattern: RegExp = /^[А-ЯЁа-яё]+(?: [А-ЯЁа-яё]+)*$/;
    const phonePattern: RegExp = /^\d[\d ]{10,}$/;

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
      this.form?.valueChanges.subscribe((): void => {
      })
    );
  }

  protected onSubmit(): void {
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
      next: (res: any): void => {
        this.isSubmitting = false;
        if (res && res.error) {
          this.submitError = 'Произошла ошибка при отправке формы, попробуйте еще раз.';
        } else {
          this.modalService.open('success');
        }
      },
      error: (): void => {
        this.isSubmitting = false;
        this.submitError = 'Произошла ошибка при отправке формы, попробуйте еще раз.';
      }
    });
  }
}
