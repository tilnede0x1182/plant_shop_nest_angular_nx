// # Importations
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';

/**
 * Intercepteur Auth - force withCredentials pour inclure le cookie httpOnly.
 * @param req HttpRequest Requête HTTP entrante
 * @param next HttpHandlerFn Handler suivant
 * @returns Observable<HttpEvent> Réponse HTTP
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const requeteAvecCreds = req.clone({ withCredentials: true });
  return next(requeteAvecCreds);
};
