// # Importations
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// # Panier
@Component({
  standalone: true,
  selector: 'app-cart',
  imports: [CommonModule],
  template: `
    <h2>🛒 Mon Panier</h2>
    <p>
      Fonctionnalité panier à implémenter (localStorage ou service partagé).
    </p>
  `,
})
export class CartComponent {}
