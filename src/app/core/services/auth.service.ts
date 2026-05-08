import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Authentikációs adatok, ahogy a json-server-auth visszaadja őket.
 */
export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  role: 'client' | 'admin';
  createdAt?: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role?: 'client' | 'admin';
}

const STORAGE_KEY = 'nailtime.auth';

/**
 * AuthService — login / register / logout, signal-alapú állapotkezelés.
 *
 * - Az állapot reaktív: a `currentUser`, `isLoggedIn`, `isAdmin` signalokat
 *   a komponensek bárhol felhasználhatják.
 * - LocalStorage perzisztencia: a JWT és a user objektum frissítés után is
 *   elérhető marad — addig, amíg a user ki nem jelentkezik.
 * - A backend a json-server-auth `/login` és `/register` végpontjait használja.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  /** Belső signal a teljes auth állapothoz */
  private readonly _state = signal<{ token: string | null; user: AuthUser | null }>(
    this.readFromStorage()
  );

  /** Olvasásra szánt signalok a UI-nak */
  readonly currentUser = computed(() => this._state().user);
  readonly token = computed(() => this._state().token);
  readonly isLoggedIn = computed(() => this._state().token !== null);
  readonly isAdmin = computed(() => this._state().user?.role === 'admin');

  // ---- HTTP műveletek ----

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.base}/login`, { email, password })
      .pipe(tap(res => this.persist(res)));
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    const fullPayload: RegisterPayload = {
      role: 'client',
      ...payload
    };
    return this.http
      .post<AuthResponse>(`${this.base}/register`, fullPayload)
      .pipe(tap(res => this.persist(res)));
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this._state.set({ token: null, user: null });
  }

  // ---- Belső helpers ----

  private persist(res: AuthResponse): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      token: res.accessToken,
      user: res.user
    }));
    this._state.set({ token: res.accessToken, user: res.user });
  }

  private readFromStorage(): { token: string | null; user: AuthUser | null } {
    if (typeof localStorage === 'undefined') {
      return { token: null, user: null };
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { token: null, user: null };
      const parsed = JSON.parse(raw);
      if (!parsed?.token) return { token: null, user: null };
      return { token: parsed.token, user: parsed.user ?? null };
    } catch {
      return { token: null, user: null };
    }
  }
}
