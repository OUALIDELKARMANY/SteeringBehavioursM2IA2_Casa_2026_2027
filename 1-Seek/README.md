# Seek — population de véhicules

Ouvrir `index.html` dans un navigateur (ou servir ce dossier avec un serveur HTTP local).

- 20 véhicules au démarrage, réglables de 1 à 200 avec le slider, pendant le glissement.
- Vitesse maximale réglable de 1 à 20 avec le slider de vitesse max (valeur initiale à 4), pendant le glissement.
- Force de direction maximale réglable de 0.01 à 1.00 avec le slider de force max (valeur initiale à 0.10), pendant le glissement.
- Mode de comportement commutable : Fuite (`flee`, par défaut) ou Poursuite (`seek`).
- Cible autonome (`Target extends Vehicle`) : disque rouge se déplaçant automatiquement et bouclant continuellement sur les bords de l'écran avec `edges()`.
- Les véhicules réapparaissent au bord opposé grâce à `Vehicle.edges()`.
- À 16 px ou moins de la cible (contact/rattrapage), le véhicule réapparaît ailleurs avec une vitesse et une accélération nulles.
- Les véhicules conservés lors d'un changement d'effectif gardent leur état.

`vehicle.js` reste intact conformément aux consignes du dépôt. La sous-classe `FleeVehicle` (`fleeVehicle.js`) implémente la formule exacte de Reynolds pour `flee()` et gère le mode actif. `Target` (`target.js`) implémente la cible autonome dérivée de `Vehicle`. Les fonctions de gestion de population sont dans `population.js` ; la boucle p5 et les interactions sont dans `sketch.js`.

## Tests

Depuis ce dossier, avec Node.js (18 ou plus) :

```sh
node --test tests/*.test.mjs
```

Aucune dépendance à installer. Les tests exécutent le vrai `vehicle.js` avec un adaptateur vectoriel minimal et un aléatoire déterministe. La validation du rendu avec p5 et du glissement réel se fait également dans le navigateur.

La [spécification](EXO1_SPECIFICATION.md) décrit les règles, le workflow et les cas limites. Elle constitue le document de conception initial ; l'implémentation et les tests sont maintenant présents.
