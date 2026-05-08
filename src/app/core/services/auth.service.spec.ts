import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { AuthService, AuthResponse } from './auth.service';
import { environment } from '../../../environments/environment';

const FAKE_RES: AuthResponse = {
  accessToken: 'fake.jwt.token',
  user: {
    id: 1,
    email: 'test@test.hu',
    fullName: 'Test User',
    phone: '+36301111111',
    role: 'client'
  }
};

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('starts logged out when localStorage is empty', () => {
    expect(service.isLoggedIn()).toBeFalse();
    expect(service.currentUser()).toBeNull();
    expect(service.token()).toBeNull();
  });

  it('login() POSTs credentials and updates state on success', () => {
    service.login('test@test.hu', 'pwd123!').subscribe();

    const req = http.expectOne(`${environment.apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@test.hu', password: 'pwd123!' });
    req.flush(FAKE_RES);

    expect(service.isLoggedIn()).toBeTrue();
    expect(service.currentUser()?.email).toBe('test@test.hu');
    expect(service.token()).toBe('fake.jwt.token');
  });

  it('persists auth state to localStorage', () => {
    service.login('test@test.hu', 'pwd123!').subscribe();
    http.expectOne(`${environment.apiUrl}/login`).flush(FAKE_RES);

    const stored = JSON.parse(localStorage.getItem('nailtime.auth') ?? '{}');
    expect(stored.token).toBe('fake.jwt.token');
    expect(stored.user.id).toBe(1);
  });

  it('logout() clears state and localStorage', () => {
    service.login('test@test.hu', 'pwd123!').subscribe();
    http.expectOne(`${environment.apiUrl}/login`).flush(FAKE_RES);

    service.logout();
    expect(service.isLoggedIn()).toBeFalse();
    expect(service.currentUser()).toBeNull();
    expect(localStorage.getItem('nailtime.auth')).toBeNull();
  });

  it('isAdmin() returns true only for admin role', () => {
    service.login('a@b.hu', 'x').subscribe();
    http.expectOne(`${environment.apiUrl}/login`).flush(FAKE_RES);
    expect(service.isAdmin()).toBeFalse();

    service.logout();
    service.login('admin@x.hu', 'x').subscribe();
    http.expectOne(`${environment.apiUrl}/login`).flush({
      ...FAKE_RES,
      user: { ...FAKE_RES.user, role: 'admin' }
    });
    expect(service.isAdmin()).toBeTrue();
  });

  it('register() POSTs payload with default role=client', () => {
    service.register({
      fullName: 'X', email: 'x@x.hu', phone: '+36301', password: 'pwd1234!'
    }).subscribe();

    const req = http.expectOne(`${environment.apiUrl}/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.role).toBe('client');
    req.flush(FAKE_RES);

    expect(service.isLoggedIn()).toBeTrue();
  });
});
