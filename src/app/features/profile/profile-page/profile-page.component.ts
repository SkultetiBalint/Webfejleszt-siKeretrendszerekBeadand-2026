import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Appointment } from '../../../core/models/models';
import { AppointmentApiService } from '../../../core/services/appointment-api.service';
import { ServiceApiService } from '../../../core/services/service-api.service';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmService } from '../../../core/services/confirm.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

const DEMO_USER_ID = 1;

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoadingSpinnerComponent,
    EmptyStateComponent
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent implements OnInit {
  private readonly appointmentApi = inject(AppointmentApiService);
  private readonly serviceApi = inject(ServiceApiService);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmService);

  readonly loading = this.appointmentApi.loading;
  readonly error = this.appointmentApi.error;

  readonly editingId = signal<number | null>(null);
  readonly editNote = signal<string>('');
  readonly editDate = signal<string>('');

  readonly myUpcoming = computed(() =>
    this.appointmentApi.upcoming().filter(a => a.userId === DEMO_USER_ID)
  );
  readonly myPast = computed(() =>
    this.appointmentApi.past().filter(a => a.userId === DEMO_USER_ID)
  );

  ngOnInit(): void {
    this.appointmentApi.listByUser(DEMO_USER_ID).subscribe();
    if (this.serviceApi.services().length === 0) {
      this.serviceApi.list().subscribe();
    }
  }

  serviceName(serviceId: number): string {
    return this.serviceApi.services().find(s => s.id === serviceId)?.name ?? `#${serviceId}`;
  }

  startEdit(a: Appointment) {
    this.editingId.set(a.id);
    this.editNote.set(a.note);
    const d = new Date(a.appointmentDate);
    const pad = (n: number) => n.toString().padStart(2, '0');
    this.editDate.set(
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
    );
  }

  cancelEdit() {
    this.editingId.set(null);
  }

  saveEdit(a: Appointment) {
    const dateIso = new Date(this.editDate()).toISOString();
    this.appointmentApi.update(a.id, {
      note: this.editNote(),
      appointmentDate: dateIso
    }).subscribe({
      next: () => {
        this.toast.success('Foglalás frissítve.');
        this.cancelEdit();
      }
    });
  }

  async cancel(a: Appointment) {
    const ok = await this.confirm.ask({
      title: 'Foglalás törlése',
      message: `Biztosan törlöd ezt a foglalást? (${this.serviceName(a.serviceId)})`,
      confirmText: 'Igen, törlöm',
      cancelText: 'Mégse',
      destructive: true
    });
    if (!ok) return;

    this.appointmentApi.delete(a.id).subscribe({
      next: () => this.toast.success('Foglalás törölve.')
    });
  }

  onNoteChange(value: string) { this.editNote.set(value); }
  onDateChange(value: string) { this.editDate.set(value); }
}
