// # Importations
import { Injectable } from '@angular/core';

export type CartItem = {
  plantId: number;
  name: string;
  price: number;
  quantity: number;
};

@Injectable({ providedIn: 'root' })
export class CartService {
  private storageKey = 'cart_items';
  private items: CartItem[] = [];

  constructor() {
    this.load();
  }

  /** Ajouter une plante au panier */
  add(item: CartItem) {
    const existing = this.items.find((i) => i.plantId === item.plantId);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      this.items.push(item);
    }
    this.save();
  }

  /** Supprimer une plante du panier */
  remove(plantId: number) {
    this.items = this.items.filter((i) => i.plantId !== plantId);
    this.save();
  }

  /** Vider le panier */
  clear() {
    this.items = [];
    this.save();
  }

  /** Récupérer le contenu du panier */
  getAll(): CartItem[] {
    return [...this.items];
  }

  /** Charger depuis localStorage */
  private load() {
    const raw = localStorage.getItem(this.storageKey);
    this.items = raw ? JSON.parse(raw) : [];
  }

  /** Sauvegarder dans localStorage */
  private save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
  }
}
