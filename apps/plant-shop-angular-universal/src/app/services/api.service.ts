// # Importations
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

// # Données
export type Identifiant = number;
export type Plante = {
  id: number;
  name: string;
  price: number;
  stock: number;
  description?: string;
};
export type CommandeItem = { plantId: number; quantity: number };
export type CommandePayload = { userId: number; items: CommandeItem[] };
export type Utilisateur = {
  id: number;
  email: string;
  name?: string;
  admin?: boolean;
};

// # Service principal
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = '/api';

  /** GET /api/plants */
  listerPlantes(): Observable<Plante[]> {
    return this.http.get<Plante[]>(`${this.base}/plants`);
  }

  /** GET /api/plants/:id */
  unePlante(id: Identifiant): Observable<Plante> {
    return this.http.get<Plante>(`${this.base}/plants/${id}`);
  }

  /** POST /api/orders */
  creerCommande(payload: CommandePayload): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(`${this.base}/orders`, payload);
  }

  /** GET /api/orders/:id */
  uneCommande(id: Identifiant): Observable<any> {
    return this.http.get<any>(`${this.base}/orders/${id}`);
  }
}
