# Lavaut'Home — site vitrine

Site statique (HTML, CSS, JS, sans dépendance) pour Lavaut'Home, service de nettoyage auto à domicile dans le Pays-Haut.

## Structure

```
index.html              page d'accueil (tarifs, vidéo, réservation, contact)
mentions-legales.html   mentions légales et confidentialité
merci.html              confirmation du formulaire de contact
404.html                page d'erreur
css/style.css
js/main.js              prix, zone, réservation en 3 étapes, cookies
assets/                 logos, photos (WebP), vidéo 720p
netlify.toml            redirections des anciennes URL WordPress et en-têtes
AUDIT.md                audit de l'ancien site et corrections
```

## Déploiement sur Netlify

1. Sur Netlify : « Add new site », « Import from Git », choisir ce dépôt.
2. Pas de commande de build. Dossier de publication : `.`
3. Les formulaires `reservation` et `contact` sont détectés automatiquement (Netlify Forms) : les demandes arrivent dans l'onglet **Forms**. Pour les recevoir par e-mail : Forms, puis Form notifications.
4. Une fois le site validé, brancher le domaine `lavauthome.com` dans « Domain management ».

## Ce qui se règle dans `js/main.js`

- `PRICES` et `EXT` : la grille de prix.
- `ZONE` : les codes postaux desservis.
- `CALENDLY` : le lien de réservation.
