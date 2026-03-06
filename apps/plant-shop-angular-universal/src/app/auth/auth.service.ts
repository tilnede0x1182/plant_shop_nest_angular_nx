// # Importations
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

/**
 * Service d'authentification Angular - login, register, session.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = '/api/auth'; // proxy -> backend Nest
  user$ = new BehaviorSubject<any | null>(null);

  constructor(private http: HttpClient) {}

  /**
   * Enregistre un nouvel utilisateur.
   * @param email string Adresse email de l'utilisateur
   * @param password string Mot de passe
   * @param name string Nom de l'utilisateur (optionnel)
   * @returns Observable<any> Réponse serveur
   */
  register(email: string, password: string, name?: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/register`,
      { email, password, name },
      { withCredentials: true }
    );
  }

  /**
   * Connecte un utilisateur.
   * @param email string Adresse email
   * @param password string Mot de passe
   * @returns Observable<any> Réponse serveur
   */
  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(
        `${this.apiUrl}/login`,
        { email, password },
        { withCredentials: true }
      )
      .pipe(tap(() => this.refreshUser()));
  }

  /**
   * Déconnecte l'utilisateur.
   * @returns Observable<any> Réponse serveur
   */
  logout(): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .pipe(tap(() => this.user$.next(null)));
  }

  /**
   * Récupère l'utilisateur courant (via cookie httpOnly).
   * @returns Observable<any> Données utilisateur
   */
  getCurrentUser(): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/me`, { withCredentials: true })
      .pipe(tap((user) => this.user$.next(user)));
  }

  /**
   * Recharge l'utilisateur après login/register.
   */
  private refreshUser(): void {
    this.getCurrentUser().subscribe({
      next: (user) => this.user$.next(user),
      error: () => this.user$.next(null),
    });
  }
}
