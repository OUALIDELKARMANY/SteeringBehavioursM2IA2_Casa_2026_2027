let target;
const vehicles = [];
let sceneCanvas;
let currentMaxSpeed = SeekPopulation.INITIAL_SPEED;
let currentMaxForce = SeekPopulation.INITIAL_FORCE;
let currentMode = SeekPopulation.INITIAL_MODE;
let currentArrivalVariant = SeekPopulation.INITIAL_ARRIVAL_VARIANT;
let currentScenario = SeekPopulation.INITIAL_SCENARIO;
let debugMode = false;
let currentDetectionRadius = SeekPopulation.INITIAL_DETECTION_RADIUS;
let currentMaxFleeDuration = SeekPopulation.INITIAL_FLEE_DURATION;

function sceneHeight() {
  return Math.max(1, windowHeight - document.getElementById('controls').offsetHeight);
}

function createTargetForScenario(scenario) {
  const currentPos = (target && target.pos)
    ? { x: target.pos.x, y: target.pos.y }
    : { x: width / 2, y: height / 2 };

  if (scenario === 'scenario-2') {
    const t = new TargetFuyante(
      currentPos.x,
      currentPos.y,
      3,
      currentDetectionRadius,
      300,
      currentMaxFleeDuration
    );
    t.setDebug(debugMode);
    return t;
  }

  // Scénario 1 par défaut : Target classique
  const t = new Target(currentPos.x, currentPos.y, 3);
  return t;
}

function updateScenarioControlsVisibility(scenario) {
  const group = document.getElementById('scenario2-controls');
  if (group) {
    if (scenario === 'scenario-2') {
      group.style.opacity = '1';
      group.style.pointerEvents = 'auto';
    } else {
      group.style.opacity = '0.45';
      group.style.pointerEvents = 'none';
    }
  }
}

function updateStatusBadge() {
  const badge = document.getElementById('target-status-badge');
  if (!badge) return;

  if (currentScenario === 'scenario-2' && target instanceof TargetFuyante) {
    const staminaSec = target.stamina.toFixed(1);
    if (target.isFleeing) {
      badge.textContent = `⚡ Fuite active ! Vitesse : ${target.maxSpeed} px/f (${staminaSec}s)`;
      badge.className = 'target-badge fleeing';
    } else if (target.stamina <= 0) {
      badge.textContent = `⚠️ Cible épuisée ! Vitesse : ${target.maxSpeed} px/f (0.0s)`;
      badge.className = 'target-badge exhausted';
    } else {
      badge.textContent = `🛡️ Cible au calme : ${target.maxSpeed} px/f (${staminaSec}s)`;
      badge.className = 'target-badge normal';
    }
  } else {
    badge.textContent = `🎯 Cible : ${target.maxSpeed || 3} px/f`;
    badge.className = 'target-badge';
  }
}

function setup() {
  sceneCanvas = createCanvas(windowWidth, sceneHeight());
  sceneCanvas.parent('scene');

  // Déverrouillage de l'AudioContext lors de la première interaction utilisateur
  window.addEventListener('pointerdown', () => {
    SoundFX.getContext();
  }, { once: true });

  // Initialisation de la cible selon le scénario actif
  target = createTargetForScenario(currentScenario);

  // Sélecteur de scénario
  const scenarioSelect = document.getElementById('scenario-select');
  if (scenarioSelect) {
    scenarioSelect.value = currentScenario;
    SeekPopulation.bindScenarioSelect(scenarioSelect, scenario => {
      currentScenario = scenario;
      target = createTargetForScenario(scenario);
      updateScenarioControlsVisibility(scenario);
    });
  }

  // Contrôles spécifiques au Scénario 2
  const detectionSlider = document.getElementById('detection-radius');
  const detectionOutput = document.getElementById('detection-radius-value');
  if (detectionSlider && detectionOutput) {
    detectionSlider.value = currentDetectionRadius;
    SeekPopulation.bindDetectionSlider(detectionSlider, detectionOutput, r => {
      currentDetectionRadius = r;
      if (target && typeof target.setDetectionRadius === 'function') {
        target.setDetectionRadius(r);
      }
    });
  }

  const durationSlider = document.getElementById('flee-duration');
  const durationOutput = document.getElementById('flee-duration-value');
  if (durationSlider && durationOutput) {
    durationSlider.value = currentMaxFleeDuration;
    SeekPopulation.bindDurationSlider(durationSlider, durationOutput, d => {
      currentMaxFleeDuration = d;
      if (target && typeof target.setMaxFleeDuration === 'function') {
        target.setMaxFleeDuration(d);
      }
    });
  }

  const debugCheckbox = document.getElementById('toggle-debug');
  if (debugCheckbox) {
    debugCheckbox.checked = debugMode;
    SeekPopulation.bindDebugToggle(debugCheckbox, active => {
      debugMode = active;
      if (target && typeof target.setDebug === 'function') {
        target.setDebug(debugMode);
      }
    });
  }

  updateScenarioControlsVisibility(currentScenario);

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

  // Mise à jour de la cible : en Scénario 2, calcul des comportements face aux véhicules
  if (currentScenario === 'scenario-2' && typeof target.applyBehaviors === 'function') {
    target.applyBehaviors(vehicles);
  }
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

  // Mise à jour du badge d'état
  updateStatusBadge();
}

// Raccourci clavier 'd' pour activer/désactiver le mode debug
function keyPressed() {
  if (key === 'd' || key === 'D') {
    debugMode = !debugMode;
    if (target && typeof target.setDebug === 'function') {
      target.setDebug(debugMode);
    }
    const debugCheckbox = document.getElementById('toggle-debug');
    if (debugCheckbox) {
      debugCheckbox.checked = debugMode;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, sceneHeight());
  target.edges();
  for (const vehicle of vehicles) vehicle.edges();
}

