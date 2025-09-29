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
    localStorage.removeItem(this.userKey);
  }

  /** Vérifier si connecté */
  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    const user = this.getUser();
    const res = !!token && !!user;
    console.log('[AuthService FRONT] isAuthenticated →', res, { token, user });
    return res;
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
    console.log('[AuthService FRONT] Vérification isAdmin()');

    const user = this.getUser();
    console.log('[AuthService FRONT] état interne user =', user);

    if (!user) {
      console.log('[AuthService FRONT] Pas connecté → isAdmin=false');
      return false;
    }

    const resultat = user.admin === true;
    console.log(
      `[AuthService FRONT] email=${user.email}, admin=${user.admin} → isAdmin=${resultat}`
    );
    return resultat;
  }

  /** Stocker le token */
  private storeToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }
}
