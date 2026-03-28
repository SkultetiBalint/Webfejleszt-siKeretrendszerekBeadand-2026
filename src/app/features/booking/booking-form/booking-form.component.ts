import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.css'
})
export class BookingFormComponent {
  name = '';
  email = '';
  service = '';
  date = '';
  note = '';
  successMessage = '';

  submitForm() {
    this.successMessage = 'A foglalási kérés rögzítve lett.';
  }
}
