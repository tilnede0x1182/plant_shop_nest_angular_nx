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
  private userKey = 'current_user';

  constructor(private http: HttpClient) {}

  private storeUser(user: any) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  /** Enregistrer un utilisateur */
  register(
    email: string,
    password: string,
    name?: string
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, { email, password, name })
      .pipe(
        tap((res) => {
          this.storeToken(res.access_token);
          this.storeUser(res.user);
        })
      );
  }

  /** Login utilisateur */
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((res) => {
          this.storeToken(res.access_token);
          this.storeUser(res.user);
        })
      );
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

  getUser(): any | null {
    const data = localStorage.getItem(this.userKey);
    return data ? JSON.parse(data) : null;
  }

  isAdmin(): boolean {
    return this.getUser()?.admin === true;
  }

  /** Stocker le token */
  private storeToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }
}
