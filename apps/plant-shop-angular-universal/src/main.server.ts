/**
 * Point d'entrée SSR Angular - bootstrap côté serveur.
 */
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

/**
 * Fonction de bootstrap pour le rendu SSR.
 * @returns Promise<ApplicationRef> Instance de l'application
 */
const bootstrap = () => bootstrapApplication(App, config);

export default bootstrap;
