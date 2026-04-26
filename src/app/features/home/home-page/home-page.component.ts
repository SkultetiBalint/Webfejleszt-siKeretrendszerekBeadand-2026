import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../../../shared/components/hero/hero.component';
import { ServiceCardComponent } from '../../../shared/components/service-card/service-card.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ServiceApiService } from '../../../core/services/service-api.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    ServiceCardComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
  private readonly api = inject(ServiceApiService);

  readonly loading = this.api.loading;
  readonly error = this.api.error;

  readonly featured = computed(() => this.api.activeServices().slice(0, 3));

  ngOnInit(): void {
    if (this.api.services().length === 0) {
      this.api.list().subscribe();
    }
  }
}
