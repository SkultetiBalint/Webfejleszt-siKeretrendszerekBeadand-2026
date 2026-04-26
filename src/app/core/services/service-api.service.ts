import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Service } from '../models/models';
import { environment } from '../../../environments/environment';

/**
 * Service entitás CRUD service-e.
 *
 * - Backend: REST API (json-server) `/services` endpoint
 * - Állapotkezelés: signal-alapú belső store
 * - Computed: aktív szolgáltatások szűrt listája
 * - A komponensek egyaránt használhatják az Observable-t (HTTP) és a signalt (cache)
 */
@Injectable({ providedIn: 'root' })
export class ServiceApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/services`;

  // --- Központi állapot (store) ---
  private readonly _services = signal<Service[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly services = this._services.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  /** Derived state: csak az aktív szolgáltatások */
  readonly activeServices = computed(() => this._services().filter(s => s.isActive));

  /** Derived state: ár szerinti tartomány */
  readonly priceRange = computed(() => {
    const list = this._services();
    if (list.length === 0) return { min: 0, max: 0 };
    const prices = list.map(s => s.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  });

  // --- HTTP CRUD ---

  /** READ — összes szolgáltatás listázása (támogat search/sort paramétereket) */
  list(opts?: { search?: string; sortBy?: string; order?: 'asc' | 'desc' }): Observable<Service[]> {
    let params = new HttpParams();
    if (opts?.search) params = params.set('q', opts.search);
    if (opts?.sortBy) {
      params = params.set('_sort', opts.sortBy);
      params = params.set('_order', opts.order ?? 'asc');
    }

    this._loading.set(true);
    this._error.set(null);
    return this.http.get<Service[]>(this.base, { params }).pipe(
      tap({
        next: data => {
          this._services.set(data);
          this._loading.set(false);
        },
        error: err => {
          this._error.set('Nem sikerült betölteni a szolgáltatásokat.');
          this._loading.set(false);
        }
      })
    );
  }

  /** READ — egyetlen szolgáltatás */
  get(id: number): Observable<Service> {
    return this.http.get<Service>(`${this.base}/${id}`);
  }

  /** CREATE — új szolgáltatás létrehozása */
  create(service: Omit<Service, 'id'>): Observable<Service> {
    return this.http.post<Service>(this.base, service).pipe(
      tap(created => this._services.update(list => [...list, created]))
    );
  }

  /** UPDATE — meglévő szolgáltatás módosítása */
  update(id: number, patch: Partial<Service>): Observable<Service> {
    return this.http.patch<Service>(`${this.base}/${id}`, patch).pipe(
      tap(updated =>
        this._services.update(list => list.map(s => (s.id === id ? updated : s)))
      )
    );
  }

  /** DELETE — szolgáltatás törlése */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`).pipe(
      tap(() => this._services.update(list => list.filter(s => s.id !== id)))
    );
  }
}
