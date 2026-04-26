import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { TimeSlot } from '../models/models';
import { environment } from '../../../environments/environment';

/**
 * TimeSlot READ-only service.
 *
 * Computed: csak a szabad idősávok.
 */
@Injectable({ providedIn: 'root' })
export class TimeSlotApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/timeSlots`;

  private readonly _slots = signal<TimeSlot[]>([]);
  private readonly _loading = signal<boolean>(false);

  readonly slots = this._slots.asReadonly();
  readonly loading = this._loading.asReadonly();

  /** Derived state: csak az elérhető idősávok */
  readonly availableSlots = computed(() =>
    this._slots()
      .filter(s => s.isAvailable)
      .sort((a, b) => a.start.localeCompare(b.start))
  );

  list(): Observable<TimeSlot[]> {
    this._loading.set(true);
    return this.http.get<TimeSlot[]>(this.base).pipe(
      tap({
        next: data => {
          this._slots.set(data);
          this._loading.set(false);
        },
        error: () => this._loading.set(false)
      })
    );
  }

  /** A foglalás során az adott slotot lefoglaltra állítja */
  reserve(id: number, appointmentId: number, serviceId: number): Observable<TimeSlot> {
    return this.http.patch<TimeSlot>(`${this.base}/${id}`, {
      isAvailable: false,
      appointmentId,
      serviceId
    }).pipe(
      tap(updated => this._slots.update(list => list.map(s => (s.id === id ? updated : s))))
    );
  }

  /** Foglalás törlésekor felszabadítja az időpontot */
  release(id: number): Observable<TimeSlot> {
    return this.http.patch<TimeSlot>(`${this.base}/${id}`, {
      isAvailable: true,
      appointmentId: null,
      serviceId: null
    }).pipe(
      tap(updated => this._slots.update(list => list.map(s => (s.id === id ? updated : s))))
    );
  }
}
