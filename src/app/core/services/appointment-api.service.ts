import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Appointment } from '../models/models';
import { environment } from '../../../environments/environment';

/**
 * Appointment CRUD service.
 *
 * - Backend: REST API (json-server) `/appointments` endpoint
 * - Állapotkezelés: signal-alapú store, computed értékek (közelgő / múltbeli foglalások)
 */
@Injectable({ providedIn: 'root' })
export class AppointmentApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/appointments`;

  private readonly _appointments = signal<Appointment[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly appointments = this._appointments.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  /** Derived state: közelgő foglalások (státusz != cancelled, dátum jövőbeli) */
  readonly upcoming = computed(() => {
    const now = new Date().toISOString();
    return this._appointments()
      .filter(a => a.appointmentDate >= now && a.status !== 'cancelled')
      .sort((a, b) => a.appointmentDate.localeCompare(b.appointmentDate));
  });

  /** Derived state: múltbeli foglalások */
  readonly past = computed(() => {
    const now = new Date().toISOString();
    return this._appointments()
      .filter(a => a.appointmentDate < now || a.status === 'cancelled')
      .sort((a, b) => b.appointmentDate.localeCompare(a.appointmentDate));
  });

  list(): Observable<Appointment[]> {
    this._loading.set(true);
    this._error.set(null);
    return this.http.get<Appointment[]>(this.base).pipe(
      tap({
        next: data => {
          this._appointments.set(data);
          this._loading.set(false);
        },
        error: () => {
          this._error.set('Nem sikerült betölteni a foglalásokat.');
          this._loading.set(false);
        }
      })
    );
  }

  /** Egy konkrét felhasználó foglalásai */
  listByUser(userId: number): Observable<Appointment[]> {
    this._loading.set(true);
    this._error.set(null);
    return this.http
      .get<Appointment[]>(`${this.base}?userId=${userId}`)
      .pipe(
        tap({
          next: data => {
            this._appointments.set(data);
            this._loading.set(false);
          },
          error: () => {
            this._error.set('Nem sikerült betölteni a foglalásokat.');
            this._loading.set(false);
          }
        })
      );
  }

  get(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.base}/${id}`);
  }

  create(appointment: Omit<Appointment, 'id'>): Observable<Appointment> {
    return this.http.post<Appointment>(this.base, appointment).pipe(
      tap(created => this._appointments.update(list => [...list, created]))
    );
  }

  update(id: number, patch: Partial<Appointment>): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.base}/${id}`, patch).pipe(
      tap(updated =>
        this._appointments.update(list => list.map(a => (a.id === id ? updated : a)))
      )
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`).pipe(
      tap(() => this._appointments.update(list => list.filter(a => a.id !== id)))
    );
  }
}
