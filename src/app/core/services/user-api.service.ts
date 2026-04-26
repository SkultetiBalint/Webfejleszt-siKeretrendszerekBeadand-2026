import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models/models';
import { environment } from '../../../environments/environment';

/**
 * User READ-only service.
 * (A specifikáció csak Read műveletet vár el a "kiegészítő" entitásokon.)
 */
@Injectable({ providedIn: 'root' })
export class UserApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/users`;

  private readonly _users = signal<User[]>([]);
  readonly users = this._users.asReadonly();

  list(): Observable<User[]> {
    return this.http.get<User[]>(this.base).pipe(
      tap(data => this._users.set(data))
    );
  }

  get(id: number): Observable<User> {
    return this.http.get<User>(`${this.base}/${id}`);
  }
}
