import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = '/'; // URL relative pour fonctionner avec SSR

  // Méthode pour récupérer le message de bienvenue
  getHello(): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${this.apiUrl}/hello`);
  }
}
