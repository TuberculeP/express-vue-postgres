# Checklist RGPD

Ce document n'est **pas un audit juridique** : c'est un point de départ technique et organisationnel pour tout projet dérivé de ce boilerplate. Il liste ce qui est déjà couvert par le code, ce qui reste un choix propre à chaque projet, et les gaps techniques identifiés — avec une attention particulière à la partie admin, qui donne un accès élargi aux données personnelles des utilisateurs.

## 1. Déjà couvert par le template

- [x] Pseudonymat par défaut : un seul champ `username` unique, pas de nom/prénom réel collecté (minimisation par design).
- [x] Mots de passe hashés (bcrypt, `server/src/routes/auth/index.ts`), jamais stockés en clair.
- [x] `SESSION_SECRET` externalisé en variable d'environnement, obligatoire en production (`server/src/config/cache.config.ts`).
- [x] En-têtes de sécurité HTTP (Helmet) et rate limiting sur les routes d'authentification (`server/src/middleware/rateLimiter.middleware.ts`).
- [x] Validation stricte des entrées (schémas Zod) sur l'inscription et les actions admin.
- [x] Le mot de passe et le `googleId` ne sont jamais exposés côté admin (`USER_LIST_FIELDS` dans `server/src/routes/admin/users.ts` ne sélectionne que les champs strictement nécessaires).
- [x] Contrôle d'accès sur les routes admin (`isAuth` + `isAdmin`, `server/src/middleware/auth.middleware.ts`).

## 2. Spécifique à la partie admin

L'accès admin est lui-même un traitement de données personnelles (lecture/écriture sur la liste des utilisateurs) qui doit être encadré :

- [x] Minimisation des champs visibles par l'admin (voir section 1).
- [ ] **Traçabilité des actions admin** : aucun log d'audit actuel. Qui a changé le rôle ou désactivé quel compte, et quand, n'est pas tracé. Recommandé : une entité `AdminAuditLog` (acteur, action, cible, date) écrite à chaque `PATCH`/`DELETE` sur `/admin/users`.
- [ ] **Moindre privilège / granularité des rôles** : un seul rôle `ROLE_ADMIN` binaire aujourd'hui. Si le projet a besoin de rôles intermédiaires (support, modération...), les introduire plutôt que de donner l'accès admin complet par défaut.
- [ ] **Authentification renforcée pour les comptes admin** : pas de 2FA. À envisager si l'admin panel gère des données sensibles en prod.
- [ ] **Revue périodique des accès admin** : processus organisationnel, pas du code — prévoir qui a le rôle `ROLE_ADMIN` et pourquoi, revu régulièrement.

## 3. Droits des personnes concernées (gaps techniques)

- [ ] **Droit d'accès / portabilité** : pas d'endpoint self-service permettant à un utilisateur d'exporter ses propres données.
- [ ] **Droit à l'effacement** : le `DELETE /admin/users/:id` actuel n'est qu'un soft delete (`isActive=false`) — les données personnelles (email, username, historique) restent en base indéfiniment. À décider : anonymisation réelle (remplacer email/username par des valeurs anonymes) ou suppression complète, selon la durée de conservation du projet.
- [ ] **Droit de rectification** : ni l'email ni le `username` ne sont modifiables par l'utilisateur lui-même (pas de route `PATCH /me`).
- [ ] **Droit d'opposition / retrait du consentement** : dépend des traitements ajoutés par le projet (emailing, tracking...) — non applicable au boilerplate de base tel quel.

## 4. Sécurité des données (Art. 32 RGPD)

- [x] Mots de passe hashés, secrets en variables d'environnement, validation des entrées, rate limiting (voir section 1).
- [ ] **Chiffrement au repos** : dépend de l'hébergeur Postgres/Redis (à activer côté infra, hors scope du code applicatif).
- [ ] **HTTPS en production** : à gérer au niveau du reverse proxy / hébergeur (non géré dans le code Express).
- [ ] **Sauvegardes** : politique de sauvegarde et de restauration testée — organisationnel, à définir par projet.
- [ ] **Journalisation** : vérifier que les logs (`console.error` dans `error.middleware.ts` et les routes) ne finissent jamais par contenir des mots de passe en clair ou des données sensibles — c'est le cas actuellement (les erreurs loggées ne contiennent pas `req.body`), à garder en tête si des logs plus détaillés sont ajoutés plus tard.

## 5. Organisationnel — à décider par projet (pas du code)

- [ ] Base légale du traitement et finalités documentées (registre des traitements).
- [ ] Durée de conservation des données définie (comptes inactifs, comptes désactivés...).
- [ ] Désignation d'un DPO si le volume/la nature des données l'exige.
- [ ] Politique de confidentialité et mentions légales publiées (pas de page dédiée dans ce template).
- [ ] Localisation et contrats avec les sous-traitants (hébergeur Postgres/Redis — privilégier l'UE, DPA signé).
- [ ] Procédure de notification de violation de données sous 72h (Art. 33/34).

## Prochaines étapes recommandées (non implémentées dans cette passe)

Par ordre d'impact probable pour un projet avec une partie admin active :

1. Log d'audit des actions admin (traçabilité — section 2).
2. Endpoint self-service d'export/suppression de compte (droits des personnes — section 3).
3. 2FA sur les comptes `ROLE_ADMIN` (sécurité renforcée — section 2).
