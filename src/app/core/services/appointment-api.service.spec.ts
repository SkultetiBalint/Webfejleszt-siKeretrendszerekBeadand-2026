import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { AppointmentApiService } from './appointment-api.service';
import { Appointment } from '../models/models';
import { environment } from '../../../environments/environment';

function isoDays(d: number): string {
  const t = new Date();
  t.setDate(t.getDate() + d);
  return t.toISOString();
}

const APPS: Appointment[] = [
  // múltbeli
  { id: 1, userId: 1, serviceId: 1, appointmentDate: isoDays(-7), status: 'completed', note: '', createdAt: isoDays(-10) },
  // jövőbeli
  { id: 2, userId: 1, serviceId: 2, appointmentDate: isoDays(7),  status: 'pending',   note: 'a', createdAt: isoDays(-2) },
  // jövőbeli, lemondva → past kategóriába kell sorolja
  { id: 3, userId: 1, serviceId: 3, appointmentDate: isoDays(14), status: 'cancelled', note: '',  createdAt: isoDays(-3) }
];

describe('AppointmentApiService', () => {
  let api: AppointmentApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AppointmentApiService]
    });
    api = TestBed.inject(AppointmentApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('list() fetches appointments and stores them', () => {
    api.list().subscribe();
    http.expectOne(`${environment.apiUrl}/appointments`).flush(APPS);
    expect(api.appointments().length).toBe(3);
  });

  it('upcoming computed contains only future, non-cancelled', () => {
    api.list().subscribe();
    http.expectOne(`${environment.apiUrl}/appointments`).flush(APPS);
    expect(api.upcoming().length).toBe(1);
    expect(api.upcoming()[0].id).toBe(2);
  });

  it('past computed contains past or cancelled appointments', () => {
    api.list().subscribe();
    http.expectOne(`${environment.apiUrl}/appointments`).flush(APPS);
    const ids = api.past().map(a => a.id).sort();
    expect(ids).toEqual([1, 3]);
  });

  it('listByUser passes userId query param', () => {
    api.listByUser(7).subscribe();
    const req = http.expectOne(`${environment.apiUrl}/appointments?userId=7`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('update() PATCHes and updates store', () => {
    api.list().subscribe();
    http.expectOne(`${environment.apiUrl}/appointments`).flush(APPS);

    api.update(2, { note: 'changed' }).subscribe();
    const req = http.expectOne(`${environment.apiUrl}/appointments/2`);
    expect(req.request.method).toBe('PATCH');
    req.flush({ ...APPS[1], note: 'changed' });

    expect(api.appointments().find(a => a.id === 2)?.note).toBe('changed');
  });
});
