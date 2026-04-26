import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.css'
})
export class ServiceCardComponent {
  @Input() id?: number;
  @Input() title = '';
  @Input() duration = '';
  @Input() price = '';
  @Input() description?: string;
}
