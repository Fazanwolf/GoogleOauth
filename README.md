# GoogleOauth

Ce dépot contient un pseudo-backend en Nestjs qui implémente l'OAuth de Google en utilisant Passport ou encore la librairie "googleapis".

## Pré-requis

Suivre les instructions de [OAuth.md](./resources/OAuth2.md).

## Installation

Clonez et installez les dépendances du projet.

```bash
git clone git@github.com:Fazanwolf/GoogleOauth
cd GoogleOauth
npm install
```

### Environnement

Copier l'environnement d'exemple et remplir les valeurs.

```bash
cp .env.example .env
```

### Usage

Pour démarrer le serveur, exécutez:

```bash
npm run start:dev
```

### Documentation

Pour accéder aux différentes routes disponibles de l'api, allez sur `http://localhost:3000/api-docs`

Pour tester, copiez et collez les routes sous le tag OAuth2 dans votre navigateur.

![OAuth Example Route](./images/example_oauth_route.png)