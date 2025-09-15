// # Importations
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// # Types simples
export type Plante = {
  id: number;
  name: string;
  price: number;
  stock: number;
  description?: string;
};
export type Utilisateur = {
  id: number;
  email: string;
  name: string;
  admin: boolean;
};
export type Commande = {
  id: number;
  userId: number;
  status: string;
  items: any[];
};

// # Service API
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = '/api'; // proxy vers backend Nest

  /* ---------- Plantes ---------- */
  listerPlantes(): Observable<Plante[]> {
    return this.http.get<Plante[]>(`${this.base}/plants`);
  }
  unePlante(id: number): Observable<Plante> {
    return this.http.get<Plante>(`${this.base}/plants/${id}`);
  }
  creerPlante(data: Partial<Plante>): Observable<Plante> {
    return this.http.post<Plante>(`${this.base}/plants`, data);
  }
  majPlante(id: number, data: Partial<Plante>): Observable<Plante> {
    return this.http.patch<Plante>(`${this.base}/plants/${id}`, data);
  }
  supprimerPlante(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/plants/${id}`);
  }

  /* ---------- Utilisateurs ---------- */
  listerUtilisateurs(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.base}/users`);
  }
  unUtilisateur(id: number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.base}/users/${id}`);
  }
  supprimerUtilisateur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/users/${id}`);
  }

  /* ---------- Commandes ---------- */
  listerCommandes(): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.base}/orders`);
  }
  uneCommande(id: number): Observable<Commande> {
    return this.http.get<Commande>(`${this.base}/orders/${id}`);
  }
  creerCommande(data: any): Observable<Commande> {
    return this.http.post<Commande>(`${this.base}/orders`, data);
  }
  majCommande(id: number, data: any): Observable<Commande> {
    return this.http.patch<Commande>(`${this.base}/orders/${id}`, data);
  }
  supprimerCommande(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/orders/${id}`);
  }
}
