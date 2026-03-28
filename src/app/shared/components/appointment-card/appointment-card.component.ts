import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-appointment-card',
  standalone: true,
  imports: [],
  templateUrl: './appointment-card.component.html',
  styleUrl: './appointment-card.component.css'
})
export class AppointmentCardComponent {
  @Input() service = '';
  @Input() date = '';
  @Input() status = '';
}
