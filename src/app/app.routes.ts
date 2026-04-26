import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home-page/home-page.component').then(m => m.HomePageComponent)
  },
  {
    path: 'services',
    loadComponent: () =>
      import('./features/services/services-page/services-page.component').then(m => m.ServicesPageComponent)
  },
  {
    path: 'services/admin',
    loadComponent: () =>
      import('./features/services/services-admin-page/services-admin-page.component').then(
        m => m.ServicesAdminPageComponent
      )
  },
  {
    path: 'services/:id',
    loadComponent: () =>
      import('./features/services/service-detail-page/service-detail-page.component').then(
        m => m.ServiceDetailPageComponent
      )
  },
  {
    path: 'booking',
    loadComponent: () =>
      import('./features/booking/booking-page/booking-page.component').then(m => m.BookingPageComponent)
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile-page/profile-page.component').then(m => m.ProfilePageComponent)
  },
  {
    path: 'artists',
    loadComponent: () =>
      import('./features/artists/artists-page/artists-page.component').then(m => m.ArtistsPageComponent)
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found-page/not-found-page.component').then(m => m.NotFoundPageComponent)
  }
];
