// # Importations
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../cart.service';
import { FormsModule } from '@angular/forms';

// # Composant Cart
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  private timers: Record<number, any> = {};
  private cart = inject(CartService);
  protected items: CartItem[] = [];

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.items = this.cart.getAll();
  }

  increment(item: CartItem) {
    this.cart.update(item.id, item.quantity + 1);
    this.refresh();
  }

  decrement(item: CartItem) {
    if (item.quantity > 1) {
      this.cart.update(item.id, item.quantity - 1);
      this.refresh();
    }
  }

  delayedUpdate(id: number, value: any) {
    clearTimeout(this.timers[id]);
    const num = Number(value);
    this.timers[id] = setTimeout(() => {
      // correction et application retardées
      const corrected = this.cart.update(id, num);
      const item = this.items.find((i) => i.id === id);
      if (item) {
        item.quantity = corrected;
      }
      this.refresh();
    }, 300);
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
