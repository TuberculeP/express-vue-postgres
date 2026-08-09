# Config

| Fichier | Rôle |
|---------|------|
| `db.config.ts` | DataSource TypeORM — Postgres si `POSTGRES_URL` est défini, sinon fallback SQLite en dev. `synchronize` uniquement hors production ; en prod, le schéma passe par les migrations (`server/src/migrations/`) |
| `cache.config.ts` | Store de session — Redis en prod, SQLite en dev. `SESSION_SECRET` obligatoire en production |
| `passport.config.ts` | Stratégies `local` et `google-oauth20` |
| `storage.config.ts` | Config Multer (uploads disque) |
| `entities/` | Entités TypeORM |

Voir aussi [docs/RGPD-CHECKLIST.md](../../../docs/RGPD-CHECKLIST.md) pour la checklist complète.

## RGPD — à prévoir selon le projet

Ce qui suit dépend de l'hébergeur et ne peut pas être réglé dans ce code applicatif :

- **Chiffrement au repos** : dépend de l'hébergeur Postgres/Redis (souvent une option à activer côté infra, ex. chiffrement disque managé). Rien à faire ici, mais à vérifier avant la mise en prod.
- **Sauvegardes** : mettre en place des sauvegardes régulières de la base (`pg_dump` ou équivalent managé) et **tester la restauration** — sans quoi la sauvegarde n'a pas de valeur.
- **Localisation des sous-traitants** : héberger Postgres/Redis dans l'UE si les utilisateurs sont européens, et s'assurer d'un contrat de sous-traitance (DPA) avec l'hébergeur.
- **HTTPS** : ni `db.config.ts` ni `cache.config.ts` ne gèrent le TLS — voir la section Docker du [README.md](../../../README.md) racine.
