// # Importations
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../cart.service';

// # Composant Cart
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  private cart = inject(CartService);
  protected items: CartItem[] = [];

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.items = this.cart.getAll();
  }

  remove(id: number) {
    this.cart.remove(id);
    this.refresh();
  }

  clear() {
    this.cart.clear();
    this.refresh();
  }

  total(): number {
    return this.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }
}
