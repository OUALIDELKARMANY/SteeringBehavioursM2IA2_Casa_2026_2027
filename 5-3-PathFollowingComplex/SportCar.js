/** Voiture de course pilotée par le chemin et séparée de ses voisines. */
class SportCar extends Vehicle {
  constructor(x, y, color = '#ef4444') {
    super(x, y, random(2, 3), 0.3);
    this.r = 24;
    this.couleur = color;
    this.followPathWeight = 2;
    this.separateWeight = 1.2;
    this.pathMaxLength = 0;
  }

  applyBehaviors(vehicles, path) {
    const follow = this.follow(path).mult(this.followPathWeight);
    const separation = this.separate(vehicles).mult(this.separateWeight);
    follow.add(separation).limit(this.maxForce);
    this.applyForce(follow);
  }

  render() {
    push();
    translate(this.pos.x, this.pos.y);
    if (this.vel.magSq() > 0.01) rotate(this.vel.heading());
    noStroke();
    fill(this.couleur);
    // Carrosserie, capot, habitacle et roues sont le rendu d'un seul Vehicle.
    rectMode(CENTER);
    rect(0, 0, 42, 22, 7);
    fill('#f8fafc');
    rect(3, 0, 18, 15, 4);
    fill('#111827');
    rect(-11, -13, 10, 4, 2); rect(11, -13, 10, 4, 2);
    rect(-11, 13, 10, 4, 2); rect(11, 13, 10, 4, 2);
    fill('#fde68a');
    rect(19, -6, 3, 4, 1); rect(19, 6, 3, 4, 1);
    pop();
  }
}
