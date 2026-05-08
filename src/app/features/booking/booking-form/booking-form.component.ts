import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ServiceApiService } from '../../../core/services/service-api.service';
import { AppointmentApiService } from '../../../core/services/appointment-api.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { Appointment } from '../../../core/models/models';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.css'
})
export class BookingFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly serviceApi = inject(ServiceApiService);
  private readonly appointmentApi = inject(AppointmentApiService);
  private readonly toast = inject(ToastService);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly currentUser = this.auth.currentUser;
  readonly submitting = signal<boolean>(false);
  readonly servicesLoading = this.serviceApi.loading;
  readonly services = this.serviceApi.activeServices;

  readonly form: FormGroup = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9 -]{6,}$/)]],
    serviceId: [0, [Validators.required, Validators.min(1)]],
    appointmentDate: ['', [Validators.required, this.futureDate]],
    note: ['']
  });

  readonly selectedService = computed(() => {
    const id = Number(this.form.get('serviceId')?.value);
    return this.services().find(s => s.id === id);
  });

  ngOnInit(): void {
    if (this.serviceApi.services().length === 0) {
      this.serviceApi.list().subscribe();
    }
    const preset = Number(this.route.snapshot.queryParamMap.get('serviceId'));
    if (preset) {
      this.form.patchValue({ serviceId: preset });
    }
    // A bejelentkezett felhasználó adatait előtöltjük (de szerkeszthető marad)
    const user = this.currentUser();
    if (user) {
      this.form.patchValue({
        name: user.fullName,
        email: user.email,
        phone: user.phone
      });
    }
  }

  hasError(name: string, code: string): boolean {
    const c = this.form.get(name);
    return !!c && c.hasError(code) && (c.touched || c.dirty);
  }

  private futureDate(control: any) {
    if (!control.value) return null;
    return new Date(control.value).getTime() > Date.now() ? null : { pastDate: true };
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Néhány mező hiányos vagy hibás.');
      return;
    }

    const v = this.form.getRawValue();
    this.submitting.set(true);

    const userId = this.currentUser()?.id;
    if (userId == null) {
      this.toast.error('Be kell jelentkezned a foglaláshoz.');
      this.submitting.set(false);
      this.router.navigate(['/login']);
      return;
    }

    const payload: Omit<Appointment, 'id'> = {
      userId,
      serviceId: Number(v.serviceId),
      appointmentDate: new Date(v.appointmentDate).toISOString(),
      status: 'pending',
      note: (v.note ?? '').toString(),
      createdAt: new Date().toISOString()
    };

    this.appointmentApi.create(payload).subscribe({
      next: () => {
        this.toast.success('Foglalás sikeresen elküldve! Köszönjük.');
        this.form.reset({
          name: '',
          email: '',
          phone: '',
          serviceId: 0,
          appointmentDate: '',
          note: ''
        });
        this.submitting.set(false);
        this.router.navigate(['/profile']);
      },
      error: () => this.submitting.set(false)
    });
  }
}
