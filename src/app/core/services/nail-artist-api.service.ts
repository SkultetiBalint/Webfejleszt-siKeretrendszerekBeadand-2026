import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { NailArtist } from '../models/models';
import { environment } from '../../../environments/environment';

/**
 * NailArtist READ-only service.
 */
@Injectable({ providedIn: 'root' })
export class NailArtistApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/nailArtists`;

  private readonly _artists = signal<NailArtist[]>([]);
  readonly artists = this._artists.asReadonly();

  list(): Observable<NailArtist[]> {
    return this.http.get<NailArtist[]>(this.base).pipe(
      tap(data => this._artists.set(data))
    );
  }

  get(id: number): Observable<NailArtist> {
    return this.http.get<NailArtist>(`${this.base}/${id}`);
  }
}
