# Configuration Vercel — portfolio David METOMO

Guide pas à pas après le déploiement sur [Vercel](https://vercel.com).

**Symptômes courants en production (sans config complète) :**

| Symptôme | Cause probable |
|----------|----------------|
| CMS `EROFS` / erreur 500 en prod | Pas de **Vercel Blob** → voir étape 9 |
| Projets privés GitHub absents | `GITHUB_TOKEN` manquant ou sans scope `repo` |
| Projets / années OK | Calculés depuis GitHub + date de début de carrière (2024) |

---

## Étape 1 — Ouvrir les variables d'environnement

1. Allez sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Cliquez sur le projet **portofio-Metomo** (ou le nom de votre déploiement)
3. Menu **Settings** → **Environment Variables**
4. Pour chaque variable ci-dessous :
   - **Key** = nom de la variable
   - **Value** = valeur (voir sections détaillées)
   - Cochez **Production** (et **Preview** si vous testez les PR)
5. Cliquez **Save**

> Après toute modification de variable : **Deployments** → dernier déploiement → **⋯** → **Redeploy** (obligatoire pour appliquer les changements).

---

## Étape 2 — GitHub (projets privés + sync)

Sans token, l’API GitHub ne renvoie que les dépôts **publics**. Les dépôts privés restent invisibles en production.

### 2.1 Créer un Personal Access Token

1. GitHub → **Settings** (votre compte) → **Developer settings** → **Personal access tokens**
2. **Fine-grained token** (recommandé) ou **Classic**
3. Permissions minimales :
   - **Repository access** : *All repositories* (ou sélectionnez les dépôts concernés)
   - **Repository permissions** → **Contents** : Read-only  
   - **Metadata** : Read-only (souvent automatique)
   - Pour les dépôts privés : scope **`repo`** (classic) ou accès lecture aux repos privés (fine-grained)
4. Copiez le token (`ghp_...` ou `github_pat_...`) — il ne s’affiche qu’une fois

### 2.2 Variables à ajouter sur Vercel

| Variable | Exemple | Obligatoire |
|----------|---------|-------------|
| `GITHUB_TOKEN` | `ghp_xxxxxxxx` | **Oui** pour les privés |
| `GITHUB_USERNAMES` | `DavidDef04,alcdigitaldeveloppeur01-arch,alcdigitaldeveloppeur01` | Recommandé |
| `GITHUB_ORGS` | `ALC-Digital` | Si dépôts sous une org |
| `GITHUB_INCLUDE_FORKS` | `false` | Optionnel |
| `GITHUB_FILTER_STRICT` | `false` | `false` = tous les repos accessibles au token |

Référence locale : fichier `.env.example` à la racine du projet.

### 2.3 Vérifier après redéploiement

1. Ouvrez `https://VOTRE-DOMAINE/api/projects` dans le navigateur  
   → JSON avec `"success": true` et la liste des projets (privés sans `githubUrl`).
2. Connectez-vous au CMS : `https://VOTRE-DOMAINE/login`  
   → onglet GitHub → **Diagnostic sync** (route `/api/cms/github-sync-debug`)  
   → vérifiez `hasToken: true` et `privateCount > 0`.

---

## Étape 3 — Analytics (optionnel)

Le portfolio utilise **Vercel Analytics** (`@vercel/analytics` dans `layout.tsx`) pour le trafic — dashboard Vercel → **Analytics**.

La section **Impact mesurable** affiche : projets, **étoiles GitHub** (ou stacks techniques), années de pratique — **sans** Google Analytics.

### 3.1 Google Analytics 4 (optionnel — balise gtag dans le layout)

Si vous gardez la balise GA4 dans `layout.tsx` pour vos propres rapports GA :

1. Propriété GA4 créée pour le site ([Google Analytics](https://analytics.google.com))
2. ID de propriété numérique (ex. `494630808`) — **Admin** → **Property settings** → **Property ID**
3. Compte de service Google Cloud avec accès **Lecteur** à cette propriété

### 3.2 Créer le compte de service

1. [Google Cloud Console](https://console.cloud.google.com) → projet (ou nouveau projet)
2. **APIs & Services** → **Library** → activer **Google Analytics Data API**
3. **IAM & Admin** → **Service Accounts** → **Create**
4. Créez une clé **JSON** et téléchargez le fichier

### 3.3 Donner accès au compte de service dans GA4

1. Google Analytics → **Admin** → **Property access management**
2. **+** → ajoutez l’e-mail du compte de service (`xxx@xxx.iam.gserviceaccount.com`)
3. Rôle : **Viewer** (Lecteur)

### 3.4 Variables Vercel pour GA4

**Option A — recommandée sur Vercel (JSON en une ligne)**

| Variable | Valeur |
|----------|--------|
| `GA4_PROPERTY_ID` | `494630808` (votre ID) |
| `GOOGLE_APPLICATION_CREDENTIALS_JSON` | Contenu **complet** du fichier JSON, collé sur **une seule ligne** |

Pour obtenir la ligne JSON :
```powershell
# PowerShell (Windows)
(Get-Content "chemin\vers\ga4-service-account.json" -Raw) -replace "`r`n", "" -replace "`n", ""
```
Copiez le résultat dans la valeur de `GOOGLE_APPLICATION_CREDENTIALS_JSON`.

**Option B — fichier (moins pratique sur Vercel)**

Variable `GOOGLE_APPLICATION_CREDENTIALS` = chemin relatif vers un fichier — **non recommandé** en serverless (le fichier n’est pas déployé par défaut). Préférez l’option A.

---


## Étape 4 — CMS admin (dashboard)

| Variable | Description |
|----------|-------------|
| `ADMIN_USERNAME` | Identifiant de connexion `/login` |
| `ADMIN_PASSWORD` | Mot de passe (utilisez un mot de passe fort en production) |
| `CMS_AUTH_SECRET` | Chaîne aléatoire ≥ 32 caractères (signature des cookies) |

URL : `https://VOTRE-DOMAINE/login` → redirection vers `/dashboard`.

### 4.1 Connexion OK en local mais « Identifiants incorrects » en production

**Cause :** Vercel **n’utilise pas** `.env`, `.env.local` ni `.env.example`. Ces fichiers restent sur votre machine et ne sont en général **pas** poussés sur GitHub.

**À faire :**

1. Vercel → projet → **Settings** → **Environment Variables**
2. Ajoutez (copiez les **mêmes valeurs** que votre `.env` local, pas seulement l’exemple) :

| Variable | Exemple | Environnement |
|----------|---------|---------------|
| `ADMIN_USERNAME` | `metomo442@gmail.com` | **Production** ✓ |
| `ADMIN_PASSWORD` | votre mot de passe | **Production** ✓ |
| `CMS_AUTH_SECRET` | chaîne aléatoire 32+ caractères | **Production** ✓ |

3. **Save**, puis **Deployments** → **Redeploy** (obligatoire)
4. Sur `/login`, utilisez exactement le même identifiant et mot de passe qu’en local

**Messages d’erreur :**

| Message | Signification |
|---------|----------------|
| « CMS non configuré sur le serveur… » | `ADMIN_PASSWORD` absent sur Vercel → ajoutez la variable et redéployez |
| « Identifiants incorrects » | Variables présentes mais valeur différente de votre `.env` local (faute de frappe, espaces, mauvais environnement Preview vs Production) |

**Mot de passe avec caractères spéciaux** (`@`, `!`, `#`) : collez la valeur telle quelle dans Vercel, sans guillemets supplémentaires.

**Sécurité :** ne commitez jamais `.env` / `.env.local`. Changez le mot de passe si `.env.example` contient un mot de passe réel dans Git.

---

## Étape 5 — Formulaire de contact

| Variable | Description |
|----------|-------------|
| `GMAIL_USER` | Adresse Gmail |
| `GMAIL_APP_PASS` | [Mot de passe d’application Google](https://myaccount.google.com/apppasswords) |
| `FROM_EMAIL` | Expéditeur (souvent = `GMAIL_USER`) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Clé site Cloudflare Turnstile |
| `TURNSTILE_SECRET_KEY` | Clé secrète Turnstile |

Création Turnstile : [Cloudflare Dashboard → Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile).

---

## Étape 6 — URL du site (SEO & liens)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | URL canonique, ex. `https://david-metomo.dev` |

---

## Étape 7 — Webhook GitHub (optionnel, sync auto)

Quand vous poussez du code sur GitHub, le portfolio peut invalider le cache des projets.

1. GitHub → repo → **Settings** → **Webhooks** → **Add webhook**
2. **Payload URL** : `https://VOTRE-DOMAINE/api/github/webhook`
3. **Content type** : `application/json`
4. **Secret** : même valeur que `GITHUB_WEBHOOK_SECRET` sur Vercel
5. Événement : **Just the push event**

---

## Étape 8 — Checklist finale: redéploiement et tests

```
[ ] Toutes les variables Production enregistrées sur Vercel
[ ] Redeploy effectué (pas seulement Save)
[ ] GET /api/projects → projets privés présents (sans lien GitHub public)
[ ] Section Impact → projets, étoiles GitHub (ou stacks), années
[ ] /login → dashboard accessible
[ ] Formulaire contact → envoi test OK
[ ] Logs Vercel : Deployments → Functions → pas d’erreur "GA4" ou "GitHub"
```

---

## Étape 9 — Vercel Blob (CMS en production) — **obligatoire**

Sur Vercel, le disque est **en lecture seule** (`EROFS`). Sans Blob Store, le CMS renvoie :

`EROFS: read-only file system, open '/var/task/data/cms/site-content.json'`

### 9.1 Créer et connecter le Blob Store

1. [vercel.com/dashboard](https://vercel.com/dashboard) → votre projet
2. Onglet **Storage** → **Create Database / Store** → **Blob**
3. Nommez le store (ex. `portfolio-cms`) → **Create**
4. **Connect to Project** → sélectionnez **portofio-Metomo** → environnement **Production** (et Preview si besoin)
5. Vercel ajoute automatiquement `BLOB_READ_WRITE_TOKEN` au projet
6. **Redeploy** le dernier déploiement

### 9.2 Comportement après configuration

| Action | Où c’est stocké |
|--------|------------------|
| Hero, Expertise, Parcours, projets, certs, meta GitHub | Blob privé `cms-data/*.json` |
| Images / CV uploadés via le CMS | Blob public `cms-uploads/...` (URL complète enregistrée) |
| Première lecture sans blob | Fichiers Git `data/cms/*.json` (secours) |
| En local (sans token) | Fichiers `data/cms/` sur le disque comme avant |

### 9.3 Vérifier

1. `/dashboard` → modifiez un champ → **Enregistrer** → message de succès (plus d’erreur 500)
2. Rechargez le site public → le changement est visible
3. Les logs Vercel ne doivent plus afficher `EROFS`

---

## Dépannage rapide

| Problème | Action |
|----------|--------|
| Stats Impact incorrectes | Vérifier `GITHUB_TOKEN` pour le décompte projets / étoiles |
| Privés toujours absents | Vérifier `GITHUB_TOKEN`, scope `repo`, redéployer, tester `/api/cms/github-sync-debug` (connecté admin) |
| Projets en double / manquants | Vérifier `GITHUB_USERNAMES`, `GITHUB_ORGS`, visibilité dans `data/cms/github-meta.json` |
| Contact échoue | Logs Vercel → fonction `/api/send` ; vérifier Gmail + Turnstile |
| Variables ignorées | Redéployer après Save ; vérifier l’environnement **Production** coché |

---

## Référence — liste complète des variables

Voir `.env.example` à la racine du projet.

Variables **prioritaires** pour vos deux problèmes actuels :

1. **Blob Store** + `BLOB_READ_WRITE_TOKEN` → CMS en production
2. **`GITHUB_TOKEN`** → projets privés + étoiles GitHub
3. **`ADMIN_USERNAME`** / **`ADMIN_PASSWORD`** → CMS `/login`
