// # Importations
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
  cartCount$ = new BehaviorSubject<number>(0);

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
		this.updateCount();
  }

  /** Supprimer une plante du panier */
  remove(plantId: number) {
    this.items = this.items.filter((i) => i.plantId !== plantId);
    this.save();
		this.updateCount();
  }

  /** Vider le panier */
  clear() {
    this.items = [];
    this.save();
		this.updateCount();
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

	/** Mettre à jour le nombre d'articles du panier */
  private updateCount() {
    const total = Object.values(this.items).reduce(
      (sum, item: any) => sum + item.quantity,
      0
    );
    this.cartCount$.next(total);
  }
}
