# RAPPORT D'ANALYSE DES DUPLICATIONS DE CODE (Principe DRY)

## Introduction
Monorepo Nx combinant front Angular Universal et backend NestJS/Prisma.

---

## Violations DRY

### 1. Service Angular `ApiService` verbeux et répétitif - 🔴 Critique
`apps/plant-shop-angular-universal/src/app/services/api.service.ts` contient 17 méthodes quasi identiques (`listerPlantes`, `listerPlantesAdmin`, `majProfile`, `majUtilisateurAdmin`, etc.) qui ne diffèrent que par l’URL. Toute évolution (ajout d’un header, gestion d’erreurs, changement de base URL) nécessite de modifier chaque méthode. **Action** : introduire un helper `request<T>(method, path, body?)` ou des services spécialisés (PlantsApi, UsersApi, OrdersApi) qui composent dynamiquement les chemins `admin`/public.

### 2. Composants d’édition utilisateur dupliqués - 🟠 Haute
`AdminUserEditComponent` (`.../admin/users/user-profile-edit/...`) et `UserProfileEditComponent` (`.../users/user-profile-edit/...`) partagent la même logique : récupérer l’`id` depuis l’URL, charger l’utilisateur via `ApiService`, publier un formulaire et afficher la même structure d’erreurs. Seule la route de redirection et l’appel API changent. **Action** : créer un composant ou un hook commun (`UserEditorComponent` avec un paramètre `mode: 'self' | 'admin'`) qui gère le cycle de vie, les messages et délègue la sauvegarde via un callback.

### 3. `OrdersService` Nest répète le même `include` Prisma - 🟠 Haute
Dans `apps/plant_shop_nest/src/app/orders/orders.service.ts`, les méthodes `list`, `findAll`, `one` et `findOneForUser` réécrivent toutes `include: { orderItems: { include: { plant: true } } }`. Résultat : un changement de projection (nouvelle propriété, renommage) doit être répliqué quatre fois. **Action** : extraire une constante `const orderWithItems = { orderItems: { include: { plant: true } } };` (ou un builder) et l’utiliser via `include: orderWithItems` pour toutes les requêtes.

---

## Impact estimé

| Refactoring proposé                                        | Lignes supprimées | Complexité |
|------------------------------------------------------------|-------------------|------------|
| Refactor `ApiService` (helper + mini clients métiers)      | ~120              | Moyenne    |
| Composant partagé pour l’édition utilisateur               | ~70               | Faible     |
| Constante Prisma pour les `orderItems` + `plant`           | ~30               | Faible     |

---

## Conclusion
La duplication touche autant le front (services/composants Angular) que le backend (requêtes Prisma identiques). Centraliser ces éléments est essentiel pour appliquer DRY et alléger les évolutions futures.***
