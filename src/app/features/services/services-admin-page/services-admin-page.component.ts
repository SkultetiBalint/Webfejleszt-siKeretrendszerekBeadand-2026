import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Service } from '../../../core/models/models';
import { ServiceApiService } from '../../../core/services/service-api.service';
import { NailArtistApiService } from '../../../core/services/nail-artist-api.service';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmService } from '../../../core/services/confirm.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

/**
 * Admin oldal: a Service entitáson **teljes CRUD**-ot kínál.
 * Reactive form (model-driven) inline validációval.
 */
@Component({
  selector: 'app-services-admin-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    EmptyStateComponent
  ],
  templateUrl: './services-admin-page.component.html',
  styleUrl: './services-admin-page.component.css'
})
export class ServicesAdminPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ServiceApiService);
  readonly artistApi = inject(NailArtistApiService);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmService);

  readonly loading = this.api.loading;
  readonly services = this.api.services;
  readonly editingId = signal<number | null>(null);
  readonly submitting = signal<boolean>(false);

  readonly form: FormGroup = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
    description: ['', [Validators.required, Validators.minLength(5)]],
    durationMinutes: [60, [Validators.required, Validators.min(5), Validators.max(360)]],
    price: [5000, [Validators.required, Validators.min(0)]],
    artistId: [1, [Validators.required, Validators.min(1)]],
    isActive: [true, [Validators.required]]
  });

  ngOnInit(): void {
    if (this.api.services().length === 0) this.api.list().subscribe();
    if (this.artistApi.artists().length === 0) this.artistApi.list().subscribe();
  }

  // --- Helper getter-ek a templátnak (inline hibaüzenetek) ---
  get f() { return this.form.controls as { [k: string]: any }; }

  hasError(name: string, code: string): boolean {
    const c = this.form.get(name);
    return !!c && c.hasError(code) && (c.touched || c.dirty);
  }

  startEdit(svc: Service) {
    this.editingId.set(svc.id);
    this.form.reset({
      name: svc.name,
      description: svc.description,
      durationMinutes: svc.durationMinutes,
      price: svc.price,
      artistId: svc.artistId,
      isActive: svc.isActive
    });
  }

  cancelEdit() {
    this.editingId.set(null);
    this.form.reset({
      name: '',
      description: '',
      durationMinutes: 60,
      price: 5000,
      artistId: 1,
      isActive: true
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Kérlek javítsd a piros mezőket.');
      return;
    }

    const value = this.form.getRawValue() as Omit<Service, 'id'>;
    this.submitting.set(true);

    const editing = this.editingId();
    if (editing) {
      // UPDATE
      this.api.update(editing, value).subscribe({
        next: () => {
          this.toast.success('Szolgáltatás frissítve.');
          this.cancelEdit();
          this.submitting.set(false);
        },
        error: () => this.submitting.set(false)
      });
    } else {
      // CREATE
      this.api.create(value).subscribe({
        next: () => {
          this.toast.success('Új szolgáltatás létrehozva.');
          this.cancelEdit();
          this.submitting.set(false);
        },
        error: () => this.submitting.set(false)
      });
    }
  }

  async remove(svc: Service) {
    const ok = await this.confirm.ask({
      title: 'Szolgáltatás törlése',
      message: `Biztosan törlöd a(z) "${svc.name}" szolgáltatást? A művelet nem visszavonható.`,
      confirmText: 'Törlés',
      cancelText: 'Mégse',
      destructive: true
    });
    if (!ok) return;

    this.api.delete(svc.id).subscribe({
      next: () => this.toast.success('Szolgáltatás törölve.')
    });
  }
}
