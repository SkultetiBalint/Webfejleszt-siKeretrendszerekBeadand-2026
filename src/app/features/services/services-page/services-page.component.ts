import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceCardComponent } from '../../../shared/components/service-card/service-card.component';

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [CommonModule, ServiceCardComponent],
  templateUrl: './services-page.component.html',
  styleUrl: './services-page.component.css'
})
export class ServicesPageComponent {
  services = [
    { title: 'Gél lakk', duration: '75 perc', price: '7 500 Ft' },
    { title: 'Erősített gél lakk', duration: '90 perc', price: '8 500 Ft' },
    { title: 'Műköröm építés', duration: '120 perc', price: '11 500 Ft' },
    { title: 'Töltés', duration: '100 perc', price: '9 500 Ft' },
    { title: 'Díszítés', duration: '20 perc', price: '2 000 Ft' },
    { title: 'Körömjavítás', duration: '15 perc', price: '1 500 Ft' }
  ];
}
