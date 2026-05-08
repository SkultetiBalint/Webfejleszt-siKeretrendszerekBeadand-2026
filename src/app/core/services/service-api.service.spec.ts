import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { ServiceApiService } from './service-api.service';
import { Service } from '../models/models';
import { environment } from '../../../environments/environment';

const SVC: Service[] = [
  { id: 1, name: 'A', description: 'a', durationMinutes: 30, price: 1000, isActive: true,  artistId: 1 },
  { id: 2, name: 'B', description: 'b', durationMinutes: 60, price: 5000, isActive: false, artistId: 1 },
  { id: 3, name: 'C', description: 'c', durationMinutes: 45, price: 3000, isActive: true,  artistId: 2 }
];

describe('ServiceApiService', () => {
  let api: ServiceApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ServiceApiService]
    });
    api = TestBed.inject(ServiceApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('list() loads services into store', () => {
    api.list().subscribe();
    http.expectOne(req =>
      req.method === 'GET' && req.url === `${environment.apiUrl}/services`
    ).flush(SVC);
    expect(api.services().length).toBe(3);
  });

  it('activeServices computed filters out inactive', () => {
    api.list().subscribe();
    http.expectOne(`${environment.apiUrl}/services`).flush(SVC);
    expect(api.activeServices().length).toBe(2);
    expect(api.activeServices().every(s => s.isActive)).toBeTrue();
  });

  it('priceRange computed returns correct min/max', () => {
    api.list().subscribe();
    http.expectOne(`${environment.apiUrl}/services`).flush(SVC);
    expect(api.priceRange().min).toBe(1000);
    expect(api.priceRange().max).toBe(5000);
  });

  it('create() POSTs and appends to store', () => {
    api.list().subscribe();
    http.expectOne(`${environment.apiUrl}/services`).flush(SVC);

    api.create({
      name: 'D', description: 'd', durationMinutes: 20, price: 2000, isActive: true, artistId: 1
    }).subscribe();
    const req = http.expectOne(`${environment.apiUrl}/services`);
    expect(req.request.method).toBe('POST');
    req.flush({
      id: 4, name: 'D', description: 'd', durationMinutes: 20, price: 2000, isActive: true, artistId: 1
    });
    expect(api.services().length).toBe(4);
    expect(api.services().find(s => s.id === 4)?.name).toBe('D');
  });

  it('delete() DELETEs and removes from store', () => {
    api.list().subscribe();
    http.expectOne(`${environment.apiUrl}/services`).flush(SVC);
    api.delete(2).subscribe();
    const req = http.expectOne(`${environment.apiUrl}/services/2`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
    expect(api.services().length).toBe(2);
    expect(api.services().find(s => s.id === 2)).toBeUndefined();
  });
});
