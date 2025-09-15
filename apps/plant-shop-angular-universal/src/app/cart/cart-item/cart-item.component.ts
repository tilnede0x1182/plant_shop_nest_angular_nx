// # Importations
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../cart.service';

// # Composant CartItem
@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css'],
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Output() removeItem = new EventEmitter<number>();

  onRemove() {
    this.removeItem.emit(this.item.plantId);
  }
}
