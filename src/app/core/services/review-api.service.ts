import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Review } from '../models/models';
import { environment } from '../../../environments/environment';

/**
 * Review entitás CRUD service-e.
 * Teljes CRUD-ot támogat (Create, Read, Update, Delete).
 */
@Injectable({ providedIn: 'root' })
export class ReviewApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/reviews`;

  private readonly _reviews = signal<Review[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly reviews = this._reviews.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  /** Derived state: átlagos értékelés */
  readonly averageRating = computed(() => {
    const list = this._reviews();
    if (list.length === 0) return 0;
    const sum = list.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / list.length) * 10) / 10;
  });

  list(): Observable<Review[]> {
    this._loading.set(true);
    this._error.set(null);
    return this.http.get<Review[]>(this.base).pipe(
      tap({
        next: data => {
          this._reviews.set(data);
          this._loading.set(false);
        },
        error: () => {
          this._error.set('Nem sikerült betölteni a véleményeket.');
          this._loading.set(false);
        }
      })
    );
  }

  listByService(serviceId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.base}?serviceId=${serviceId}`);
  }

  create(review: Omit<Review, 'id'>): Observable<Review> {
    return this.http.post<Review>(this.base, review).pipe(
      tap(created => this._reviews.update(list => [...list, created]))
    );
  }

  update(id: number, patch: Partial<Review>): Observable<Review> {
    return this.http.patch<Review>(`${this.base}/${id}`, patch).pipe(
      tap(updated =>
        this._reviews.update(list => list.map(r => (r.id === id ? updated : r)))
      )
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`).pipe(
      tap(() => this._reviews.update(list => list.filter(r => r.id !== id)))
    );
  }
}
