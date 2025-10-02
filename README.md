# Plant Shop – Angular + NestJS (Nx)

Magasin de plantes complet avec frontend Angular (SSR via Angular Universal) et backend NestJS, orchestrés avec Nx.
Inspiré du projet Rails et de la version Next.js, ce monorepo fournit une architecture modulaire, maintenable et prête pour la production.

---

## 📖 Introduction

Note sur Nx :
J'ai utilisé Nx pour essayer de simplifier le SSR, mais je ne suis pas sûr que c'était indispensable.

---

## 🚀 Lancer le projet

### Développement
- Frontend (Angular Universal SSR) :
  pnpm dev
- Backend (NestJS seul, sans SSR) :
  pnpm dev-back
- Frontend seul (Angular SPA avec proxy vers backend) :
  pnpm dev-front

Accès :
- Frontend SSR : http://localhost:4200
- Frontend SPA : http://localhost:8300
- Backend API Nest : http://localhost:4100/api

### Production
- Build complet (front + back) :
  pnpm build
- Lancer serveur SSR (Angular + Nest) :
  pnpm start

---

## 🧪 Tests End-to-End

Pour effectuer le test End-to-End des routes du backend Nest :
1. Lancer le serveur Nest en mode test :
   make test-e2e
2. Dans un second terminal, lancer le test des routes :
   make test-routes

---

## 📦 Structure principale

apps/
- plant-shop-angular-universal → Frontend Angular Universal
- plant_shop_nest → Backend NestJS

prisma/ → Modèle de données et seed
tests/ → Scénarios de test complet

---

## 🛠️ Technologies

- **Frontend** : Angular 20, Angular Universal, Bootstrap 5
- **Backend** : NestJS 11, Prisma, JWT Auth
- **Monorepo** : Nx 21
- **BDD** : PostgreSQL via Prisma Client

---

## 🔐 Authentification

- JWT géré côté backend (NestJS) et stocké en cookie httpOnly sécurisé
- Intercepteur Angular qui force `withCredentials` pour inclure automatiquement le cookie dans toutes les requêtes HTTP
- Guards pour protéger les routes : `AuthGuard`, `AdminGuard`

---

## 🛒 Fonctionnalités principales

- Parcourir les plantes disponibles (filtrées par stock > 0)
- Ajouter au panier (persistance locale, compteur dynamique en navbar)
- Passer commande avec calcul automatique du total
- Authentification utilisateurs + rôles (admin / non-admin)
- Espace admin pour gestion CRUD des plantes et des utilisateurs

---

## 📂 Scripts utiles

- pnpm test-routes → test de toutes les routes avec un script Node
- pnpm seed → initialise la base avec données fictives via Prisma

---

## ⚙️ Configuration

Proxy configuré pour router le frontend vers le backend Nest sur /api :
proxy.conf.json
