// # Importations
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export type AuthResponse = {
  access_token: string;
  user: { id: number; email: string; admin?: boolean };
};

// # Service d'authentification
@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = '/api/auth'; // proxy -> backend Nest
  private tokenKey = 'jwt_token';

  constructor(private http: HttpClient) {}

  /** Enregistrer un utilisateur */
  register(
    email: string,
    password: string,
    name?: string
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, { email, password, name })
      .pipe(tap((res) => this.storeToken(res.access_token)));
  }

  /** Login utilisateur */
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap((res) => this.storeToken(res.access_token)));
  }

  /** Logout */
  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  /** Vérifier si connecté */
  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  /** Récupérer le token */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /** Stocker le token */
  private storeToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }
}
