import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home-page/home-page.component').then(m => m.HomePageComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login-page/login-page.component').then(m => m.LoginPageComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register-page/register-page.component').then(m => m.RegisterPageComponent)
  },
  {
    path: 'services',
    loadComponent: () =>
      import('./features/services/services-page/services-page.component').then(m => m.ServicesPageComponent)
  },
  {
    path: 'services/admin',
    canActivate: [adminGuard],
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
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/booking/booking-page/booking-page.component').then(m => m.BookingPageComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
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
