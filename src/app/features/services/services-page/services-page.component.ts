import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

import { ServiceCardComponent } from '../../../shared/components/service-card/service-card.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ServiceApiService } from '../../../core/services/service-api.service';

type SortKey = 'name' | 'price' | 'durationMinutes';
type SortOrder = 'asc' | 'desc';

const PAGE_SIZE = 4;

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ServiceCardComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent
  ],
  templateUrl: './services-page.component.html',
  styleUrl: './services-page.component.css'
})
export class ServicesPageComponent implements OnInit {
  private readonly api = inject(ServiceApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly search = signal<string>('');
  readonly sortKey = signal<SortKey>('name');
  readonly sortOrder = signal<SortOrder>('asc');
  readonly onlyActive = signal<boolean>(true);
  readonly page = signal<number>(1);

  readonly loading = this.api.loading;
  readonly error = this.api.error;

  private readonly searchInput$ = new Subject<string>();

  readonly filteredServices = computed(() => {
    const term = this.search().trim().toLowerCase();
    let list = this.api.services().slice();

    if (this.onlyActive()) {
      list = list.filter(s => s.isActive);
    }
    if (term) {
      list = list.filter(s =>
        s.name.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term)
      );
    }

    const key = this.sortKey();
    const order = this.sortOrder();
    list.sort((a, b) => {
      const av: any = (a as any)[key];
      const bv: any = (b as any)[key];
      if (typeof av === 'string' && typeof bv === 'string') {
        return order === 'asc' ? av.localeCompare(bv, 'hu') : bv.localeCompare(av, 'hu');
      }
      return order === 'asc' ? Number(av) - Number(bv) : Number(bv) - Number(av);
    });

    return list;
  });

  readonly pagedServices = computed(() => {
    const all = this.filteredServices();
    const start = (this.page() - 1) * PAGE_SIZE;
    return all.slice(start, start + PAGE_SIZE);
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredServices().length / PAGE_SIZE))
  );

  ngOnInit(): void {
    const qp = this.route.snapshot.queryParamMap;
    this.search.set(qp.get('q') ?? '');
    this.sortKey.set((qp.get('sortBy') as SortKey) ?? 'name');
    this.sortOrder.set((qp.get('order') as SortOrder) ?? 'asc');
    this.onlyActive.set(qp.get('active') !== 'false');
    this.page.set(Number(qp.get('page')) || 1);

    this.searchInput$
      .pipe(debounceTime(250), distinctUntilChanged())
      .subscribe(value => {
        this.search.set(value);
        this.page.set(1);
        this.syncUrl();
      });

    if (this.api.services().length === 0) {
      this.api.list().subscribe();
    }
  }

  onSearchInput(value: string) {
    this.searchInput$.next(value);
  }

  onSortChange(key: SortKey) {
    if (this.sortKey() === key) {
      this.sortOrder.update(o => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortKey.set(key);
      this.sortOrder.set('asc');
    }
    this.syncUrl();
  }

  toggleOnlyActive() {
    this.onlyActive.update(v => !v);
    this.page.set(1);
    this.syncUrl();
  }

  goToPage(p: number) {
    if (p < 1 || p > this.totalPages()) return;
    this.page.set(p);
    this.syncUrl();
  }

  private syncUrl() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: this.search() || null,
        sortBy: this.sortKey(),
        order: this.sortOrder(),
        active: this.onlyActive() ? null : 'false',
        page: this.page() === 1 ? null : this.page()
      },
      queryParamsHandling: 'merge'
    });
  }
}
