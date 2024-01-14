# Thorium Server

Thorium Server est un serveur express personnalisable qui peut être utilisé comme module ou incorporé dans le thorium-cli (un utilitaire en ligne de commande pour compiler, servir ou créer un projet Thorium).

## Installation

Pour installer Thorium Server, vous pouvez utiliser npm :

```bash
npm install thorium-server
```

## Utilisation

```typescript
import { preloadConfiguration, ThoriumServer } from 'thorium-server';

// Charger la configuration du serveur
const server: ThoriumServer = await preloadConfiguration();

// Le serveur est prêt, vous pouvez l'utiliser selon vos besoins.
```

## Configuration

Thorium Server peut être configuré en utilisant un fichier server.config.json situé à la racine du projet. 

Voici un exemple de fichier de configuration :

```json
{
  "main": "src/main.js",
  "package": "build/myApp.zip",
  "devServer": {
    "port": 3000
  },
  "routes": ["src/routes/api.js", "src/routes/web.js"],
  "debug": true,
  "client": {
    "views": {
      "/home": "src/views/home.hbs",
      "/about": "src/views/about.hbs"
    }
  }
}
```

## Propriétés de configuration :

- main (facultatif): Chemin vers le fichier principal de l'application à exécuter.
- package (facultatif): Chemin vers un fichier zip ou une solution contenant le code source emballé.
- devServer (facultatif): Options de configuration pour le webpack-dev-server.
- routes (facultatif): Chemins vers les scripts de routeurs à charger.
- debug (facultatif): Activer/désactiver le mode débogage.
- client (facultatif): Options spécifiques au client.
- client.views (facultatif): Chemins vers les fichiers de vue et les routes correspondantes.

# Exemples

Configuration minimale :