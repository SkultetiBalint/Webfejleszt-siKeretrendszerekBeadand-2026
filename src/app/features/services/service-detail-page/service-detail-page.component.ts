import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { Service, NailArtist, Review } from '../../../core/models/models';
import { ServiceApiService } from '../../../core/services/service-api.service';
import { NailArtistApiService } from '../../../core/services/nail-artist-api.service';
import { ReviewApiService } from '../../../core/services/review-api.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-service-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './service-detail-page.component.html',
  styleUrl: './service-detail-page.component.css'
})
export class ServiceDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly serviceApi = inject(ServiceApiService);
  private readonly artistApi = inject(NailArtistApiService);
  private readonly reviewApi = inject(ReviewApiService);

  readonly loading = signal<boolean>(true);
  readonly notFound = signal<boolean>(false);
  readonly service = signal<Service | null>(null);
  readonly artist = signal<NailArtist | null>(null);
  readonly reviews = signal<Review[]>([]);

  /** Computed: átlagos értékelés a review-kből */
  readonly avgRating = computed(() => {
    const list = this.reviews();
    if (list.length === 0) return 0;
    const sum = list.reduce((a, r) => a + r.rating, 0);
    return Math.round((sum / list.length) * 10) / 10;
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.notFound.set(true);
      this.loading.set(false);
      return;
    }

    this.serviceApi.get(id).subscribe({
      next: svc => {
        this.service.set(svc);
        // Párhuzamos kapcsolódó adatok lekérése
        forkJoin({
          artist: this.artistApi.get(svc.artistId),
          reviews: this.reviewApi.listByService(svc.id)
        }).subscribe({
          next: ({ artist, reviews }) => {
            this.artist.set(artist);
            this.reviews.set(reviews);
            this.loading.set(false);
          },
          error: () => this.loading.set(false)
        });
      },
      error: () => {
        this.notFound.set(true);
        this.loading.set(false);
      }
    });
  }
}
