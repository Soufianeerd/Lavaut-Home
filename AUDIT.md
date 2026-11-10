# Audit de lavauthome.com et corrections de la refonte

Audit réalisé le 10 novembre 2026 sur le site WordPress en ligne : les 5 pages du sitemap, la page « À propos », l'article par défaut, le code source, les formulaires, le Calendly et les médias.

## 1. Pages et liens

| Constat sur l'ancien site | Gravité | Dans la refonte |
|---|---|---|
| `/a-propos/` renvoie une **erreur 500** (« Il y a eu une erreur critique sur ce site »). Le bouton « Voir plus » de l'accueil y mène. | Bloquant | Section « Sur le terrain » avec photos et vidéo ; redirection 301 de `/a-propos/` |
| `/mentions-legales/` est **vide** : en-tête et pied de page seulement, aucun texte. Obligatoire au titre de la LCEN (art. 6). | Légal | Page `mentions-legales.html` complète (éditeur, hébergeur, RGPD, cookies) ; les champs administratifs restent à fournir |
| Article WordPress par défaut **« Hello world! »** toujours publié (`/2023/08/03/hello-world/`) et présent dans le sitemap. | Image | Supprimé ; redirection 301 |
| Les 4 cartes véhicules, leurs images et les 13 boutons « Prendre RDV » mènent tous vers la même page, sans transmettre le véhicule ni le niveau choisis. | Conversion | Le prix rapide et la réservation transmettent véhicule, niveau, option et prix |
| La page Réservation n'est qu'un Calendly générique (« Lavage automobile à votre domicile », 2h30) : le client ne précise ni véhicule, ni état, ni adresse. | Conversion | Pré-qualification en 2 étapes, puis Calendly pré-rempli (nom, e-mail, récapitulatif) |
| Sur la page Services, le tableau dit « 30,00 € avec l'extérieur » : on peut comprendre que le prix total passe à 30 €. | Clarté | « Extérieur : +30 € », bouton qui ajoute les 30 € à tout le tableau |

## 2. Contact et confiance

| Constat | Dans la refonte |
|---|---|
| **Aucun numéro de téléphone** sur le site, alors que le 06 68 83 67 73 figure sur l'utilitaire et dans la vidéo. | Numéro cliquable dans l'en-tête, le hero, le contact et la barre mobile |
| Aucun lien vers Instagram (@lavauthome, 199 abonnés, stories « Avant/Après » et « Nos tarifs »). | Liens Instagram (contact, réalisations, pied de page, données structurées) |
| Les « avis clients » (Sophie D., Pierre A., David R.) sont génériques et invérifiables : risque de pratique commerciale trompeuse (art. L121-2 du Code de la consommation). | Supprimés. À remplacer par de vrais avis Google une fois la fiche créée |
| Textes génériques (« splendeur de votre berline », « luxe du lavage »), aucune vraie photo. Les seules photos sont des banques d'images. | Textes réécrits à partir des vraies infos (Calendly, vidéo, Instagram) ; photos tirées de la vidéo du client |
| L'info **« locaux partenaires »** (vidéo + Instagram) n'apparaît nulle part sur le site. | Mise en avant : choix « à domicile / locaux partenaires » dans la réservation |
| La clientèle belge et luxembourgeoise (drapeaux FR/BE/LU sur Instagram) n'est pas mentionnée. | Section zone « aux trois frontières » ; le vérificateur de code postal accepte BE et LU |

## 3. Technique et performance

| Constat | Dans la refonte |
|---|---|
| Vidéo de présentation en **4K 60 i/s de 330 Mo** (`C2614_5-2.mp4`), servie telle quelle. | Version web 720p de **7 Mo** avec `faststart`, chargée seulement au clic sur lecture, avec image d'aperçu |
| Page d'accueil d'environ 5 Mo : 25 feuilles de style et 27 scripts (Elementor, Essential Addons, Header Footer Elementor, Creative Mail, Formidable, Jetpack). | HTML/CSS/JS statique, une feuille de style, un script, aucune dépendance |
| WordPress 6.5.3, pas à jour (surface d'attaque). | Site statique : pas de back-office exposé |
| Images 1080×1080 en PNG (jusqu'à 2,4 Mo pièce), servies pour des vignettes. | WebP en 960 et 1920 px, de 10 à 60 Ko, avec `srcset` |
| 15 images sur 15 **sans texte alternatif**. | Toutes les images ont un `alt` (ou `alt=""` si elles sont décoratives) |

## 4. SEO

| Constat | Dans la refonte |
|---|---|
| Aucune meta description, sur aucune page. | Meta description sur toutes les pages |
| Titres vagues : « Accueil - Lavauthome », « Reservation - Lavauthome ». | « Lavage auto à domicile Pays-Haut · Longwy, Villerupt \| Lavaut'Home » |
| Le H1 est « Réservez dès maintenant votre lavage à domicile » sur l'accueil ; aucun H1 sur les autres pages. | Un H1 par page, hiérarchie H2/H3 propre |
| Aucune ville citée, à part « Pays-Haut ». | Communes listées, données structurées `areaServed` |
| Pas de données structurées pour l'activité. | JSON-LD `AutoWash` : téléphone, horaires, prix, zone, Instagram |
| Les anciennes URL seraient perdues lors d'un changement de site. | `netlify.toml` : redirections 301 de toutes les anciennes URL |

## 5. RGPD et cookies

| Constat | Dans la refonte |
|---|---|
| Bandeau « Si vous continuez à utiliser ce site, nous supposerons que vous en êtes satisfait » : consentement implicite, **non conforme** aux lignes directrices de la CNIL. | Bandeau avec boutons Refuser / Accepter de même poids ; Calendly (qui dépose des cookies) chargé seulement après accord |
| Formulaire de contact sans mention d'information RGPD. | Mention sous chaque formulaire et politique de confidentialité |
| Jetpack (statistiques WordPress.com) chargé sans consentement. | Aucun traceur |

## Données récupérées et réutilisées

- **Tarifs** (page Services) : Citadine 50 / 65 / 80 €, Berline 60 / 75 / 90 €, SUV 70 / 85 / 100 €, Utilitaire 80 / 110 / 140 €, extérieur +30 €.
- **Prestations** : vitres, dépoussiérage, shampouinage tapis et sièges, brosse électrique, aspiration, finition tapis, coffre ; à l'extérieur : lavage complet, lustrage, cire, traitement des surfaces.
- **Horaires** : du lundi au samedi, 8h30–18h.
- **Calendly** `calendly.com/lavauthome/2` : durée 2h30, créneaux à 8h00, 10h30, 13h00 et 15h30.
- **Formulaire de contact** : nom, prénom, e-mail, téléphone, message.
- **Téléphone** : 06 68 83 67 73 (utilitaire et vidéo).
- **Instagram** : @lavauthome, avec la bio « Service de nettoyage et lustrage auto à domicile et dans nos locaux partenaires. Professionnels et particuliers. »
- **Logos et vidéo** : fichiers d'origine du site ; photos extraites de la vidéo, plaques d'immatriculation floutées.

## À fournir par Lavaut'Home avant la mise en ligne

1. Les mentions légales : nom ou raison sociale, statut, SIRET, adresse, e-mail, directeur de la publication.
2. Une adresse e-mail de contact (aucune n'est publiée sur l'ancien site).
3. L'adresse de la page Facebook : `facebook.com/lavauthome` renvoie « contenu indisponible ».
4. La confirmation de la liste des communes desservies (dans `js/main.js`, constante `ZONE`).
5. De vrais avis Google, à intégrer quand la fiche Google Business existe.
6. Le nom de domaine : pointer `lavauthome.com` vers Netlify une fois le site validé.
