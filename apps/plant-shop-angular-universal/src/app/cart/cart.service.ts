// # Importations
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// # Données
export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  stock: number;
};

@Injectable({ providedIn: 'root' })
export class CartService {
  private storageKey = 'cart';
  private items: Record<number, CartItem> = {};
  cartCount$ = new BehaviorSubject<number>(0);

  constructor() {
    this.load();
    this.updateCount();
  }

  /** Ajouter une plante */
  add(id: number, name: string, price: number, stock: number) {
    if (!this.items[id]) {
      this.items[id] = { id, name, price, quantity: 0, stock };
    }
    if (this.items[id].quantity < stock) {
      this.items[id].quantity++;
    } else {
      alert(`Stock insuffisant pour ${name}, reste ${stock}.`);
    }
    this.save();
    this.updateCount();
  }

  /** Mettre à jour quantité */
  update(id: number, quantity: number) {
    if (!this.items[id]) return;
    const corrected = Math.min(Math.max(quantity, 1), this.items[id].stock);
    this.items[id].quantity = corrected;
    this.save();
    this.updateCount();
  }

  /** Supprimer un produit */
  remove(id: number) {
    delete this.items[id];
    this.save();
    this.updateCount();
  }

  /** Vider le panier */
  clear() {
    this.items = {};
    localStorage.removeItem(this.storageKey);
    this.updateCount();
  }

  /** Récupérer le contenu du panier */
  getAll(): CartItem[] {
    return Object.values(this.items);
  }

  /** Total général */
  getTotal(): number {
    return this.getAll().reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  /** Payload API */
  toOrderPayload() {
    return this.getAll().map((item) => ({
      plantId: item.id,
      quantity: item.quantity,
    }));
  }

  /** Charger depuis localStorage */
  private load() {
    const raw = localStorage.getItem(this.storageKey);
    this.items = raw ? JSON.parse(raw) : {};
  }

  /** Sauvegarder dans localStorage */
  private save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
  }

  /** Mettre à jour compteur */
  private updateCount() {
    const total = this.getAll().reduce((sum, item) => sum + item.quantity, 0);
    this.cartCount$.next(total);
  }
}
