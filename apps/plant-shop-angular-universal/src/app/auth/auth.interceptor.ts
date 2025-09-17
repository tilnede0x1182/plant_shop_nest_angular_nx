// # Importations
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';

/**
 * Ajoute le JWT au header Authorization si présent en localStorage
 * Gère SSR en vérifiant la présence de window
 * @req requête initiale
 * @next suite de la chaîne d'intercepteurs
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  // # Fonctions utilitaires
  const isBrowser = typeof window !== 'undefined';
  const getToken = (): string | null => {
    if (!isBrowser) return null;
    try {
      return localStorage.getItem('jwt_token');
    } catch (StorageException) {
      return null;
    }
  };

  // # Interception principale
  const jeton = getToken();
  if (!jeton) return next(req);

  const requeteAvecAuth = req.clone({
    setHeaders: { Authorization: `Bearer ${jeton}` },
  });

  return next(requeteAvecAuth);
};
