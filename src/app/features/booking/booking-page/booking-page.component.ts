import { Component } from '@angular/core';
import { BookingFormComponent } from '../booking-form/booking-form.component';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [BookingFormComponent],
  templateUrl: './booking-page.component.html',
  styleUrl: './booking-page.component.css'
})
export class BookingPageComponent {}
