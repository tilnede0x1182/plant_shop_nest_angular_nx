// # Importations
import { Route } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AdminGuard } from './auth/admin.guard';

export const appRoutes: Route[] = [
  // 🌿 Produits
  {
    path: 'plants',
    loadComponent: () =>
      import('./plants/plants-list/plants-list.component').then(
        (m) => m.PlantsListComponent
      ),
  },
  {
    path: 'plants/:id',
    loadComponent: () =>
      import('./plants/plant-detail/plant-detail.component').then(
        (m) => m.PlantDetailComponent
      ),
  },
  {
    path: 'plants/new',
    loadComponent: () =>
      import('./plants/plant-form/plant-form.component').then(
        (m) => m.PlantFormComponent
      ),
    canActivate: [AuthGuard],
  },

  // 👤 Auth
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },

  // 🛒 Panier
  {
    path: 'cart',
    loadComponent: () =>
      import('./cart/cart/cart.component').then((m) => m.CartComponent),
  },

  // 📦 Commandes
  {
    path: 'orders/new',
    loadComponent: () =>
      import('./orders/order-new/order-new.component').then(
        (m) => m.OrderNewComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'orders/:id',
    loadComponent: () =>
      import('./orders/order-detail/order-detail.component').then(
        (m) => m.OrderDetailComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./orders/order-list/order-list.component').then(
        (m) => m.OrderListComponent
      ),
    canActivate: [AuthGuard],
  },

  // ⚙️ Admin
  {
    path: 'admin/users',
    loadComponent: () =>
      import('./admin/users-list/users-list.component').then(
        (m) => m.AdminUsersListComponent
      ),
    canActivate: [AdminGuard],
  },
  {
    path: 'admin/plants',
    loadComponent: () =>
      import('./admin/plants-list/plants-list.component').then(
        (m) => m.AdminPlantsListComponent
      ),
    canActivate: [AdminGuard],
  },

  // Route par défaut
  { path: '', redirectTo: '/plants', pathMatch: 'full' },

  // 404
  { path: '**', redirectTo: '/plants' },
];
