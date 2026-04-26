import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NailArtistApiService } from '../../../core/services/nail-artist-api.service';
import { ServiceApiService } from '../../../core/services/service-api.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-artists-page',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './artists-page.component.html',
  styleUrl: './artists-page.component.css'
})
export class ArtistsPageComponent implements OnInit {
  private readonly artistApi = inject(NailArtistApiService);
  private readonly serviceApi = inject(ServiceApiService);

  readonly artists = this.artistApi.artists;
  readonly loading = computed(() =>
    this.artistApi.artists().length === 0 || this.serviceApi.loading()
  );

  ngOnInit(): void {
    this.artistApi.list().subscribe();
    if (this.serviceApi.services().length === 0) {
      this.serviceApi.list().subscribe();
    }
  }

  /** Hány aktív szolgáltatás tartozik az adott művészhez */
  servicesOf(artistId: number): number {
    return this.serviceApi.services().filter(s => s.artistId === artistId && s.isActive).length;
  }
}
