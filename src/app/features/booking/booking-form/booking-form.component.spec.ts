import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { BookingFormComponent } from './booking-form.component';

describe('BookingFormComponent', () => {
  let component: BookingFormComponent;
  let fixture: ComponentFixture<BookingFormComponent>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [BookingFormComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form is invalid when empty', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('email control validates format', () => {
    const email = component.form.get('email')!;
    email.setValue('not-email');
    expect(email.hasError('email')).toBeTrue();
    email.setValue('valid@x.hu');
    expect(email.valid).toBeTrue();
  });

  it('appointmentDate flagged as past when set to a past time', () => {
    const ctrl = component.form.get('appointmentDate')!;
    ctrl.setValue('2000-01-01T10:00');
    expect(ctrl.hasError('pastDate')).toBeTrue();
  });
});
