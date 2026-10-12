// Cible autonome se déplaçant automatiquement et bouclant continuellement sur les bords.
// Conforme à AGENTS.md : toute entité visible étend Vehicle.
class Target extends Vehicle {
  constructor(x, y, speed = 3) {
    super(x, y);
    this.r = 16;
    this.color = 'red';
    this.maxSpeed = speed;

    // Vitesse autonome initiale
    if (typeof p5 !== 'undefined' && p5.Vector && typeof p5.Vector.random2D === 'function') {
      this.vel = p5.Vector.random2D();
      this.vel.setMag(speed);
    } else {
      this.vel = createVector(speed, 0);
    }
  }

  update() {
    // Locomotion standard héritée de Vehicle (applique vel à pos, remet acc à zéro)
    super.update();
    // Passage d'un bord à l'autre pour rester continuellement dans l'espace de jeu
    this.edges();
  }

  // Tâche 10 - Variante B : repositionnement aléatoire de la cible lorsqu'elle est atteinte
  respawn(w, h, rng = Math.random) {
    const margin = this.r * 2;
    const minW = Math.max(0, w - margin * 2);
    const minH = Math.max(0, h - margin * 2);
    const x = margin + rng() * minW;
    const y = margin + rng() * minH;
    this.pos.set(x, y);
  }

  show() {
    push();
    fill(this.color);
    noStroke();
    circle(this.pos.x, this.pos.y, this.r * 2);
    pop();
  }
}