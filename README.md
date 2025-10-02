# 🌿 PlantShop - E-commerce Botanique (Angular / NestJS / Prisma / Nx)

Application complète de vente de plantes construite avec **Angular** (frontend) et **NestJS** (backend), orchestrée par **Nx** pour la gestion monorepo.
Elle offre une interface utilisateur moderne côté client 🌱 et un espace d’administration sécurisé 🔐 pour la gestion des plantes, des commandes et des utilisateurs.
Un script de seed réaliste alimente automatiquement la base PostgreSQL avec des plantes 🪴, des comptes 👤 et des commandes 📦.

---

## 🛠 Stack Technique

### 🧩 Backend

- **Langage & Framework**
  - TypeScript
  - NestJS (API REST)
- **Base de données & ORM**
  - PostgreSQL
  - Prisma (migrations, modèles, seed via `prisma/seed.ts`)
  - FakerJS + BcryptJS pour les données factices
- **Authentification**
  - JWT (avec `passport-local` et `passport-jwt`)
  - Cookies httpOnly
  - Guards NestJS (`AuthGuard`, `RolesGuard`)
  - Middleware pour protéger `/admin`

### 🎨 Frontend

- **Framework & Rendu**
  - Angular 20
  - Angular Universal (SSR)
  - Nx (gestion monorepo, builds et tests)
- **UI/UX**
  - Bootstrap 5.3.8
  - Styles custom (`src/styles.css`)
- **Panier**
  - Stockage via `localStorage`
  - Mise à jour dynamique (quantité, total, suppression)
  - Synchronisation avec le backend lors des commandes

---

## ✨ Fonctionnalités

### 👥 Côté client

- **🛍 Catalogue**
  - Liste des plantes filtrée par stock
  - Tri alphabétique
- **📄 Détail produit**
  - Nom, description, prix, stock
  - Ajout direct au panier
- **🛒 Panier**
  - Quantités ajustables
  - Totaux dynamiques
  - Persistance locale
- **✅ Commandes**
  - Création de commande depuis le panier
  - Historique utilisateur
- **👤 Compte utilisateur**
  - Inscription / connexion
  - Profil modifiable

### 🔧 Administration

- **🌱 Plantes**
  - CRUD complet (ajout, édition, suppression)
- **👥 Utilisateurs**
  - Gestion avec rôles (`USER`, `ADMIN`)
- **📦 Commandes**
  - Consultation des commandes
- **🔐 Sécurité**
  - Guards et rôles appliqués côté client & serveur

### 🛡 Sécurité

- JWT stocké côté serveur (cookie httpOnly)
- Bcrypt pour le hachage des mots de passe
- Guards NestJS (`AuthGuard`, `AdminGuard`)
- Middleware Angular/Nest pour restreindre l’accès

---

## 🚀 Installation et lancement

### 🔧 Prérequis

- Node.js ≥ 18
- PostgreSQL ≥ 13
- pnpm (gestionnaire recommandé avec Nx)

### ⚙️ Étapes

```bash
# 1) Installer les dépendances
pnpm install

# 2) Créer la base de données et exécuter les migrations Prisma
pnpm prisma migrate dev

# 3) Remplir la base avec des données factices
pnpm prisma db seed

# 4) Lancer le backend NestJS (http://localhost:4100)
pnpm dev-back

# 5) Lancer le frontend Angular (http://localhost:8300)
pnpm dev-front

# 6) Lancer en mode SSR (http://localhost:4150)
pnpm start
```
