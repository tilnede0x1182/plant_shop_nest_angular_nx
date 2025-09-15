// # Importations
import { Route } from '@angular/router';

// # Routes principales (standalone)
export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./components/plants-list.component').then(
        (m) => m.PlantsListComponent
      ),
  },
  {
    path: 'plants/:id',
    loadComponent: () =>
      import('./components/plant-detail.component').then(
        (m) => m.PlantDetailComponent
      ),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./components/cart.component').then((m) => m.CartComponent),
  },
  {
    path: 'orders/new',
    loadComponent: () =>
      import('./components/order-new.component').then(
        (m) => m.OrderNewComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
