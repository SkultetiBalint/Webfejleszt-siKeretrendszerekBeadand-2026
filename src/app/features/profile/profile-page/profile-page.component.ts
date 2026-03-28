import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentCardComponent } from '../../../shared/components/appointment-card/appointment-card.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, AppointmentCardComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {
  appointments = [
    { service: 'Erősített gél lakk', date: '2026. 03. 24. 14:00', status: 'Megerősítve' },
    { service: 'Töltés', date: '2026. 04. 02. 10:30', status: 'Függőben' }
  ];
}
