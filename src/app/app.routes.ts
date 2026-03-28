import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/home-page/home-page.component';
import { ServicesPageComponent } from './features/services/services-page/services-page.component';
import { BookingPageComponent } from './features/booking/booking-page/booking-page.component';
import { ProfilePageComponent } from './features/profile/profile-page/profile-page.component';
import { NotFoundPageComponent } from './features/not-found/not-found-page/not-found-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'services', component: ServicesPageComponent },
  { path: 'booking', component: BookingPageComponent },
  { path: 'profile', component: ProfilePageComponent },
  { path: '**', component: NotFoundPageComponent }
];
