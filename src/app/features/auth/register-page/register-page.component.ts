import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  readonly submitting = signal(false);

  readonly form: FormGroup = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9 -]{6,}$/)]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      // Legalább 1 betű és 1 szám
      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
    ]],
    passwordConfirm: ['', [Validators.required]]
  }, {
    validators: [(group) => {
      const pwd = group.get('password')?.value;
      const cfm = group.get('passwordConfirm')?.value;
      return pwd && cfm && pwd !== cfm ? { passwordMismatch: true } : null;
    }]
  });

  hasError(name: string, code: string): boolean {
    const c = this.form.get(name);
    return !!c && c.hasError(code) && (c.touched || c.dirty);
  }

  get passwordMismatch(): boolean {
    return !!this.form.errors?.['passwordMismatch'] &&
      (this.form.get('passwordConfirm')?.touched ?? false);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { fullName, email, phone, password } = this.form.getRawValue();
    this.submitting.set(true);
    this.auth.register({
      fullName, email, phone, password, role: 'client'
    }).subscribe({
      next: () => {
        this.toast.success('Sikeres regisztráció. Be is léptettelek.');
        this.router.navigateByUrl('/');
        this.submitting.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        if (err.status === 400) {
          this.toast.error('Ezzel az email címmel már regisztráltak.');
        }
      }
    });
  }
}
