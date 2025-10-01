// # Importations
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../cart.service';

// # Composant Cart
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
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

  onInput(item: CartItem, event: any) {
    const val = Number(event.target.value);
    if (!isNaN(val) && val > 0 && val <= item.stock) {
      this.cart.update(item.id, val);
      this.refresh();
    }
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
