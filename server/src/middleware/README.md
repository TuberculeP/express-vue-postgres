# Middlewares

| Fichier | Rôle |
|---------|------|
| `auth.middleware.ts` | `isAuth` (session active requise), `isAdmin` (`req.user.role === "ROLE_ADMIN"`) |
| `validate.middleware.ts` | `validateBody(schema)` — valide `req.body` avec un schéma Zod, renvoie `400` sinon |
| `error.middleware.ts` | Handler d'erreur centralisé, formate la réponse à partir d'une `AppError` ou renvoie `500` générique |
| `rateLimiter.middleware.ts` | `authLimiter` — limite les tentatives sur `/auth/login` et `/auth/register` |

Voir aussi [docs/RGPD-CHECKLIST.md](../../../docs/RGPD-CHECKLIST.md) pour la checklist complète.

## RGPD — à prévoir selon le projet

Ce qui suit dépend trop du contexte projet pour être dans le boilerplate par défaut, mais s'accroche directement à ces middlewares :

- **2FA sur les comptes `ROLE_ADMIN`** : si l'admin panel gère des données sensibles en prod, ajouter un TOTP (`otplib` ou `speakeasy`) — champ `twoFactorSecret` sur `User`, vérification supplémentaire à brancher dans `isAdmin` (ou une nouvelle route `/auth/2fa/verify` entre `passport.authenticate("local")` et la création de session).
- **Granularité des rôles / moindre privilège** : `role` est aujourd'hui binaire (`ROLE_USER`/`ROLE_ADMIN`). Si le projet a besoin de rôles intermédiaires (support, modération...), les introduire plutôt que de donner l'accès admin complet par défaut — `isAdmin` devient alors `hasRole(...roles)`.
- **Revue périodique des accès admin** : processus organisationnel — prévoir qui a le rôle `ROLE_ADMIN`, pourquoi, et à quelle fréquence c'est revu. Pas de code à ajouter ici (`GET /admin/users` ne filtre pas encore par rôle, ce serait un ajout mineur si besoin).
