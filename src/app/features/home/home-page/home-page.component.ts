import { Component } from '@angular/core';
import { HeroComponent } from '../../../shared/components/hero/hero.component';
import { ServiceCardComponent } from '../../../shared/components/service-card/service-card.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [HeroComponent, ServiceCardComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  featuredServices = [
    { title: 'Erősített gél lakk', duration: '90 perc', price: '8 500 Ft' },
    { title: 'Műköröm építés', duration: '120 perc', price: '11 500 Ft' },
    { title: 'Töltés', duration: '100 perc', price: '9 500 Ft' }
  ];
}
