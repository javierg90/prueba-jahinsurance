import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'home' }
];
