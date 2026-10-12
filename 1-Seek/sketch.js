let target;
const vehicles = [];
let sceneCanvas;
let currentMaxSpeed = SeekPopulation.INITIAL_SPEED;
let currentMaxForce = SeekPopulation.INITIAL_FORCE;
let currentMode = SeekPopulation.INITIAL_MODE;
let currentArrivalVariant = SeekPopulation.INITIAL_ARRIVAL_VARIANT;

function sceneHeight() {
  return Math.max(1, windowHeight - document.getElementById('controls').offsetHeight);
}

function setup() {
  sceneCanvas = createCanvas(windowWidth, sceneHeight());
  sceneCanvas.parent('scene');

  // Tâche 9 : Cible autonome se déplaçant seule et bouclant aux bords
  target = new Target(width / 2, height / 2, 3);

  const speedSlider = document.getElementById('max-speed');
  const speedOutput = document.getElementById('max-speed-value');
  speedSlider.value = SeekPopulation.INITIAL_SPEED;
  SeekPopulation.bindSpeedSlider(speedSlider, speedOutput, vehicles, speed => {
    currentMaxSpeed = speed;
  });

  const forceSlider = document.getElementById('max-force');
  const forceOutput = document.getElementById('max-force-value');
  forceSlider.value = SeekPopulation.INITIAL_FORCE;
  SeekPopulation.bindForceSlider(forceSlider, forceOutput, vehicles, force => {
    currentMaxForce = force;
  });

  const behaviorSelect = document.getElementById('behavior-mode');
  if (behaviorSelect) {
    behaviorSelect.value = currentMode;
    SeekPopulation.bindBehaviorSelect(behaviorSelect, vehicles, mode => {
      currentMode = mode;
    });
  }

  // Tâche 10 : Gestion de la variante d'arrivée (Variante A : véhicule réapparaît / Variante B : cible réapparaît)
  const arrivalSelect = document.getElementById('arrival-variant');
  if (arrivalSelect) {
    arrivalSelect.value = currentArrivalVariant;
    SeekPopulation.bindArrivalSelect(arrivalSelect, variant => {
      currentArrivalVariant = variant;
    });
  }

  const slider = document.getElementById('vehicle-count');
  slider.value = SeekPopulation.INITIAL_COUNT;
  SeekPopulation.bindSlider(slider, document.getElementById('vehicle-count-value'),
    vehicles, target.pos, () => ({ width, height }), (x, y) => {
      const v = new FleeVehicle(x, y, currentMode);
      v.maxSpeed = currentMaxSpeed;
      v.maxForce = currentMaxForce;
      return v;
    });

  // Clic optionnel sur le canvas pour repositionner la cible autonome si souhaité
  sceneCanvas.elt.addEventListener('pointerdown', event => {
    const rect = sceneCanvas.elt.getBoundingClientRect();
    const x = (event.clientX - rect.left) * width / rect.width;
    const y = (event.clientY - rect.top) * height / rect.height;
    if (x >= 0 && x <= width && y >= 0 && y <= height) {
      target.pos.set(x, y);
    }
  });
}

function draw() {
  background('black');

  // Tâche 9 : La cible autonome avance et reboucle sur les bords
  target.update();

  // Tâche 9 & 10 : Les véhicules poursuivent la cible autonome et gèrent l'arrivée selon la variante
  for (const vehicle of vehicles) {
    SeekPopulation.step(vehicle, target, width, height, Math.random, currentArrivalVariant);
    vehicle.show();
  }

  target.show();
}

function windowResized() {
  resizeCanvas(windowWidth, sceneHeight());
  target.edges();
  for (const vehicle of vehicles) vehicle.edges();
}
