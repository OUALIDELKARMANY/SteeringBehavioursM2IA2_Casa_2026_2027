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

  // Déverrouillage de l'AudioContext lors de la première interaction utilisateur
  window.addEventListener('pointerdown', () => {
    SoundFX.getContext();
  }, { once: true });

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

  // Tâche 10 : Gestion de la variante d'arrivée
  const arrivalSelect = document.getElementById('arrival-variant');
  if (arrivalSelect) {
    arrivalSelect.value = currentArrivalVariant;
    SeekPopulation.bindArrivalSelect(arrivalSelect, variant => {
      currentArrivalVariant = variant;
    });
  }

  // Dégradés de fond et traînées
  const bgSelect = document.getElementById('bg-preset');
  if (bgSelect) {
    bgSelect.value = BackgroundFX.getPreset();
    bgSelect.addEventListener('change', () => {
      BackgroundFX.setPreset(bgSelect.value);
    });
  }

  const trailsCheckbox = document.getElementById('toggle-trails');
  if (trailsCheckbox) {
    trailsCheckbox.checked = BackgroundFX.hasTrails();
    trailsCheckbox.addEventListener('change', () => {
      BackgroundFX.setTrails(trailsCheckbox.checked);
    });
  }

  // Contrôles du son Web Audio API
  const soundBtn = document.getElementById('sound-btn');
  const soundVolume = document.getElementById('sound-volume');
  if (soundBtn) {
    soundBtn.classList.toggle('active', !SoundFX.isMuted());
    soundBtn.addEventListener('click', () => {
      const muted = SoundFX.toggleMute();
      soundBtn.textContent = muted ? '🔇 Muet' : '🔊 Son';
      soundBtn.classList.toggle('active', !muted);
    });
  }
  if (soundVolume) {
    soundVolume.addEventListener('input', () => {
      SoundFX.setVolume(Number(soundVolume.value));
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

  // Repositionnement au clic sur le canvas
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
  // Rendu du fond dégradé (avec ou sans traînées)
  BackgroundFX.render(width, height);

  // Mise à jour de la cible autonome
  target.update();

  // Mise à jour des véhicules avec notification sonore lors de l'arrivée (Web Audio API)
  for (const vehicle of vehicles) {
    SeekPopulation.step(
      vehicle,
      target,
      width,
      height,
      Math.random,
      currentArrivalVariant,
      variant => SoundFX.playArrivalSound(variant)
    );
    vehicle.show();
  }

  target.show();
}

function windowResized() {
  resizeCanvas(windowWidth, sceneHeight());
  target.edges();
  for (const vehicle of vehicles) vehicle.edges();
}
