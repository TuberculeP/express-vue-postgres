# Express Vue PostgreSQL

Stack full-stack moderne avec Express.js, Vue 3, PostgreSQL/SQLite, authentification (Local + Google OAuth), WebSockets et Tailwind CSS.

## Stack technique

| Couche | Technologies |
|--------|-------------|
| Backend | Express.js, TypeORM, Passport.js, Socket.io, Multer, Zod, Helmet, express-rate-limit |
| Frontend | Vue 3 (Composition API), Pinia, Vue Router, Axios |
| UI | Tailwind CSS v4, shadcn-vue (reka-ui), Lucide Icons |
| Base de donnees | PostgreSQL (prod) / SQLite (dev) |
| Sessions | Redis (prod) / SQLite (dev) |
| Build | Vite, TypeScript, ESLint, Prettier |

## Structure du projet

```
├── server/src/
│   ├── main.ts                    # Point d'entree Express + Socket.io
│   ├── config/
│   │   ├── db.config.ts           # Configuration TypeORM
│   │   ├── passport.config.ts     # Strategies d'authentification
│   │   ├── cache.config.ts        # Store de sessions (Redis/SQLite)
│   │   ├── storage.config.ts      # Configuration Multer (uploads)
│   │   └── entities/              # Entites TypeORM (User, Upload)
│   ├── routes/
│   │   ├── auth/index.ts          # Routes d'authentification
│   │   ├── admin/                 # Routes admin (isAuth + isAdmin), exemple CRUD users
│   │   └── shared/uploads.ts      # Route d'upload de fichiers
│   ├── middleware/                # validate, error, rateLimiter, auth (isAuth/isAdmin)
│   ├── scripts/seedAdmin.ts       # Cree/promeut le compte admin par defaut
│   └── events/                    # Handlers WebSocket
│
├── webapp/src/
│   ├── main.ts                    # Initialisation Vue
│   ├── App.vue                    # Composant racine
│   ├── router.ts                  # Configuration des routes
│   ├── stores/authStore.ts        # Store Pinia (authentification)
│   ├── components/ui/             # Composants shadcn-vue
│   ├── layouts/AppLayout.vue      # Layout principal
│   ├── views/                     # Pages de l'application
│   └── lib/
│       ├── utils.ts               # Utilitaire cn() pour les classes
│       └── utils/
│           ├── apiClient.ts       # Client HTTP Axios
│           ├── websocket.ts       # Utilitaires Socket.io
│           └── types.ts           # Types TypeScript
│
├── public/uploads/                # Fichiers uploades
├── dist/                          # Build de production
└── docker-compose.yml             # Services Docker
```

## Installation

```bash
# Installer les dependances
npm install

# Lancer en developpement
npm run dev
```

L'application demarre sur http://localhost:3000

## Variables d'environnement

Copier `.env.example` vers `.env` a la racine et completer les valeurs :

```env
# Secret de signature des cookies de session (requis en production)
SESSION_SECRET=change-me

# Compte admin cree/promu automatiquement au demarrage (optionnel)
DEFAULT_ADMIN_EMAIL=
DEFAULT_ADMIN_PASSWORD=

# Base de donnees (optionnel en dev - utilise SQLite par defaut)
POSTGRES_URL=postgres://user:password@localhost:5432/dbname

# Google OAuth (optionnel - desactive le bouton Google si absent)
GOOGLE_CLIENT_ID=votre_client_id
GOOGLE_CLIENT_SECRET=votre_client_secret
GOOGLE_CALLBACK_URL=/api/auth/google/callback
```

En production, le serveur refuse de demarrer si `SESSION_SECRET` est absent.

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de developpement avec hot-reload |
| `npm run build` | Build de production (serveur + client) |
| `npm start` | Lancer le build de production |
| `npm run lint` | Linter ESLint |
| `npm run dockerize` | Demarrer avec Docker Compose |

## API Routes

### Authentification (`/api/auth`)

| Methode | Route | Description |
|---------|-------|-------------|
| GET | `/config` | Retourne `{ googleAuthEnabled: boolean }` |
| POST | `/register` | Inscription (username, email, password) |
| POST | `/login` | Connexion (email, password) |
| GET | `/check` | Verifie si l'utilisateur est connecte |
| POST | `/logout` | Deconnexion |
| GET | `/google` | Initie le flow Google OAuth |
| GET | `/google/callback` | Callback Google OAuth |
| GET | `/me/export` | RGPD (portabilite) : telecharge les donnees de l'utilisateur connecte en JSON |
| PATCH | `/me` | RGPD (rectification) : modifie son propre `username` |
| DELETE | `/me` | RGPD (effacement) : anonymise son propre compte et deconnecte |

### Fichiers (`/api/shared`)

| Methode | Route | Description |
|---------|-------|-------------|
| POST | `/uploads` | Upload de fichier (authentifie, max 10MB) |

### Admin (`/api/admin`)

Toutes les routes admin passent par `isAuth` puis `isAdmin` (`server/src/middleware/auth.middleware.ts`), qui verifient la session et `req.user.role === "ROLE_ADMIN"`.

| Methode | Route | Description |
|---------|-------|-------------|
| GET | `/users` | Liste paginee des utilisateurs (`?page`, `?limit`, `?search`) |
| GET | `/users/:id` | Detail d'un utilisateur |
| PATCH | `/users/:id` | Modifie `role` et/ou `isActive` (interdit de se demoter/desactiver soi-meme) |
| DELETE | `/users/:id` | Suspension reversible (`isActive=false`, interdit sur soi-meme) |
| POST | `/users/:id/erase` | RGPD (effacement) : anonymise definitivement l'utilisateur cible (irreversible, interdit sur soi-meme) |
| GET | `/audit-log` | Historique paginé des actions admin (`role_updated`, `deactivated`, `reactivated`, `anonymized`) |

Cette route `admin/users` sert d'exemple de CRUD admin, a dupliquer pour toute autre entite necessitant une gestion back-office. Chaque action de `PATCH`/`DELETE`/`erase` est tracee via `logAdminAction()` (`server/src/services/adminAudit.service.ts`).

## Utilitaires frontend

### API Client

```typescript
import apiClient from "@/lib/utils/apiClient";

// GET request
const { data, error } = await apiClient.get<User>("/auth/check");

// POST request
const { data, error } = await apiClient.post("/auth/login", { email, password });

// Avec FormData
const formData = new FormData();
formData.append("file", file);
const { data, error } = await apiClient.post("/shared/uploads", formData);
```

Le client retourne toujours `{ data, error }` et ne throw jamais d'exception.

### WebSocket

```typescript
import { onSocketConnected, onSocketEvent, socket } from "@/lib/utils/websocket";

// Ecouter la connexion
onSocketConnected(() => {
  console.log("Connecte au serveur WebSocket");
});

// Ecouter un evenement
onSocketEvent("test:response", (data) => {
  console.log("Reponse recue:", data);
});

// Emettre un evenement
socket.emit("test:default", { message: "Hello" });
```

### Auth Store (Pinia)

```typescript
import { useAuthStore } from "@/stores/authStore";
import { storeToRefs } from "pinia";

const { user, isAuthenticated } = storeToRefs(useAuthStore());
```

## Ajouter des composants shadcn-vue

```bash
npx shadcn-vue@latest add button input card dialog
```

Les composants sont installes dans `webapp/src/components/ui/`.

## Ajouter une nouvelle route API

1. Creer le fichier route dans `server/src/routes/`
2. L'enregistrer dans `server/src/routes/index.ts`

```typescript
// server/src/routes/example/index.ts
import { Router } from "express";

const exampleRouter = Router();

exampleRouter.get("/", (req, res) => {
  res.json({ message: "Hello" });
});

export default exampleRouter;
```

```typescript
// server/src/routes/index.ts
import exampleRouter from "./example";

router.use("/example", exampleRouter);
```

## Ajouter un evenement WebSocket

1. Creer le handler dans `server/src/events/`
2. L'enregistrer dans `eventGroupList`

```typescript
// server/src/events/chat.event.ts
import { Socket } from "socket.io";

export const prefix = "chat";

export function handleEvents(socket: Socket) {
  socket.on("chat:message", (data) => {
    socket.broadcast.emit("chat:message", data);
  });
}
```

```typescript
// server/src/events/event_handler.ts
import * as chatEvents from "./chat.event";

const eventGroupList = [testEvents, chatEvents];
```

## Ajouter une entite TypeORM

```typescript
// server/src/config/entities/Post.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Post {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.posts)
  author: User;
}
```

Exporter dans `server/src/config/entities/index.ts` et ajouter a la liste `entities` dans `db.config.ts`.

## Migrations TypeORM

En developpement, `synchronize: true` reste actif (schema auto-synchronise a partir des entites, pratique pour iterer vite). En production (`NODE_ENV=production`), `synchronize` est desactive : le schema doit passer par des migrations versionnees, executees automatiquement au demarrage (`pg.runMigrations()` dans `main.ts`).

Apres avoir modifie une entite :

```bash
# Necessite une base Postgres accessible via POSTGRES_URL
npm run migration:generate -- server/src/migrations/NomDeLaMigration

# Appliquer les migrations en attente
npm run migration:run

# Annuler la derniere migration appliquee
npm run migration:revert
```

## Compte admin par defaut

Si `DEFAULT_ADMIN_EMAIL` et `DEFAULT_ADMIN_PASSWORD` sont definis dans `.env`, `seedDefaultAdmin()` (`server/src/scripts/seedAdmin.ts`) s'execute a chaque demarrage :

- Si l'email n'existe pas encore, un compte `ROLE_ADMIN` est cree avec ce mot de passe.
- Si l'email existe deja, il est promu `ROLE_ADMIN` s'il ne l'est pas deja.
- Si les variables sont absentes, l'operation est silencieusement ignoree.

Un utilisateur admin peut ensuite gerer les autres utilisateurs sur `/app/admin/users` (lien "Admin" visible dans le header une fois connecte).

## Docker

```bash
# Demarrer tous les services
npm run dockerize

# Ou manuellement
docker compose -f docker-compose.yml -f docker-compose.local.yml up --build
```

Services :
- **PostgreSQL** (port 5432)
- **Redis** (cache de sessions)
- **App Node** (port 3000)

**HTTPS** : ni Express ni Helmet ne terminent le TLS. En production, mettre l'app derriere un reverse proxy (Caddy, Nginx, Traefik) ou un load balancer manage qui gere le certificat.

## Conformite RGPD

Ce template privilegie le pseudonymat (`username` unique, pas de nom/prenom reel) pour minimiser les donnees personnelles collectees par defaut, et couvre deja les droits d'acces/rectification/effacement (`/api/auth/me/*`) ainsi que la tracabilite des actions admin (`/api/admin/audit-log`). Voir [docs/RGPD-CHECKLIST.md](docs/RGPD-CHECKLIST.md) pour le detail de ce qui est couvert, [server/src/middleware/README.md](server/src/middleware/README.md) et [server/src/config/README.md](server/src/config/README.md) pour ce qui reste a decider/implementer selon le projet (2FA admin, chiffrement au repos, sauvegardes...).

## Patterns et conventions

- **API Client** : Toujours utiliser `apiClient` - retourne `{ data, error }`
- **Authentification** : Les routes protegees utilisent le guard dans `router.ts`
- **Sessions** : Cookies securises avec TTL de 1 jour
- **Passwords** : Hashes avec bcrypt (10 rounds)
- **Fichiers** : Stockes dans `public/uploads/`, metadonnees en BDD
- **Etat frontend** : Utiliser `storeToRefs()` pour la reactivite Pinia
- **Classes CSS** : Utiliser `cn()` pour combiner les classes Tailwind
- **Validation** : Schemas Zod par route (`*.schemas.ts`), appliques via `validateBody()` (`server/src/middleware/validate.middleware.ts`)
- **Erreurs backend** : Wrapper les handlers async avec `asyncHandler()`, lever une `AppError(message, statusCode)` pour les erreurs metier - le middleware final (`server/src/middleware/error.middleware.ts`) formate la reponse
- **Rate limiting** : `authLimiter` applique sur `/auth/login` et `/auth/register` (`server/src/middleware/rateLimiter.middleware.ts`)
- **Routes admin** : Monter sous `server/src/routes/admin/`, proteger avec `isAuth, isAdmin` (`server/src/middleware/auth.middleware.ts`). Guard frontend correspondant : `adminGuard` dans `router.ts` (meta `requiresAdmin`)
