# Seek — population de véhicules

Ouvrir `index.html` dans un navigateur (ou servir ce dossier avec un serveur HTTP local).

- **Menu déroulant de scénarios :**
  - **Scénario 1 (Poursuite standard) :** Les vaisseaux poursuivent la cible autonome `Target` et réapparaissent aléatoirement lors d'un contact.
  - **Scénario 2 (Cible fuyante `TargetFuyante`) :** La cible fuit le vaisseau le plus proche lorsqu'il pénètre dans son cercle de détection (200 px par défaut, réglable par curseur). Elle utilise la méthode héritée `flee()`, accélère et augmente sa vitesse jusqu'à distancer le prédateur de 300 px (distance d'échappatoire). Hors de portée, elle reprend son allure normale. Sa fuite est limitée par une réserve d'endurance (2,5 s max, réglable par curseur) affichée sous forme de barre colorée au-dessus de la cible.
- **Mode Debug (Touche 'd') :** Visualisation commutable du cercle de détection de la cible (jaune par défaut, rouge lorsqu'un prédateur est à l'intérieur).
- 20 véhicules au démarrage, réglables de 1 à 200 avec le slider, pendant le glissement.
- Vitesse maximale réglable de 1 à 20 avec le slider de vitesse max (valeur initiale à 4), pendant le glissement.
- Force de direction maximale réglable de 0.01 à 1.00 avec le slider de force max (valeur initiale à 0.10), pendant le glissement.
- Mode de comportement commutable : Poursuite (`seek`, par défaut pour Tâche 9) ou Fuite (`flee`).
- Variante d'arrivée commutable (Tâche 10) : Variante A (véhicule réapparaît aléatoirement) ou Variante B (la cible réapparaît aléatoirement).
- Fonds à dégradés personnalisables (`BackgroundFX`) : Nuit boréale, Cyberpunk, Crépuscule, Abysses, Matrice, Noir classique.
- Option de traînées lumineuses (motion blur esthétique avec persistance visuelle).
- Effets sonores temps réel via la **Web Audio API** native (`SoundFX`) : pops pentatoniques pour la réapparition du véhicule, sonnette cristalline pour la cible, bouton Muet et curseur de volume.
- Cible autonome (`Target extends Vehicle`) : disque rouge se déplaçant automatiquement et bouclant continuellement sur les bords de l'écran avec `edges()`.
- Les véhicules réapparaissent au bord opposé grâce à `Vehicle.edges()`.
- À 16 px ou moins de la cible (contact/rattrapage), déclenchement de la réapparition selon la variante sélectionnée et émission d'un son Web Audio.
- Les véhicules conservés lors d'un changement d'effectif gardent leur état.

`vehicle.js` reste intact conformément aux consignes du dépôt. La classe `TargetFuyante` (`targetFuyante.js`) implémente la cible fuyante avec hystérésis, endurance et mode debug. La sous-classe `FleeVehicle` (`fleeVehicle.js`) implémente la formule exacte de Reynolds pour `flee()` et gère le mode actif. `Target` (`target.js`) implémente la cible autonome dérivée de `Vehicle`. `BackgroundFX` (`backgroundEffects.js`) et `SoundFX` (`soundEffects.js`) gèrent les effets visuels et sonores. Les fonctions de gestion de population sont dans `population.js` ; la boucle p5 et les interactions sont dans `sketch.js`.

## Tests

Depuis ce dossier, avec Node.js (18 ou plus) :

```sh
node --test tests/*.test.mjs
```

Aucune dépendance à installer. Les tests exécutent le vrai `vehicle.js` avec un adaptateur vectoriel minimal et un aléatoire déterministe. La validation du rendu avec p5 et du glissement réel se fait également dans le navigateur.

La [spécification](EXO1_SPECIFICATION.md) décrit les règles, le workflow et les cas limites. Elle constitue le document de conception initial ; l'implémentation et les tests sont maintenant présents.
