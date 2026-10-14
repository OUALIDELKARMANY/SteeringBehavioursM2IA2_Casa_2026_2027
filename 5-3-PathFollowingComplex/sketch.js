// Circuit complexe suivi par une flotte de voitures autonomes.
let debug = false;
let path;
let vehicles = [];
let carColors = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#06b6d4'];
let nextColor = 0;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('scene');
  newPath();
  newVehicle(width / 2, height / 2);
  setupControls();
}

function draw() {
  drawCircuitBackground();
  path.display();
  for (const car of vehicles) {
    car.applyBehaviors(vehicles, path);
    car.edges();
    car.update();
    car.render();
  }
  document.getElementById('car-count').textContent = `${vehicles.length} voiture${vehicles.length > 1 ? 's' : ''}`;
}

function drawCircuitBackground() {
  background('#39734b');
  noStroke();
  for (let y = 0; y < height; y += 44) {
    fill(255, 255, 255, y % 88 === 0 ? 10 : 4);
    rect(0, y, width, 22);
  }
  fill('#f8fafc');
  textAlign(LEFT, BOTTOM);
  textSize(11);
  text('SPORT CIRCUIT  •  PATH FOLLOWING', 18, height - 18);
}

function newPath() {
  path = new Path();
  const count = 30;
  const rx = Math.max(80, Math.min(width * 0.34, height * 0.46));
  const ry = Math.max(70, Math.min(height * 0.34, width * 0.42));
  for (let i = 0; i < count; i++) {
    const angle = TWO_PI * i / count;
    const wobble = random(0.88, 1.12);
    path.addPoint(width / 2 + cos(angle) * rx * wobble,
      height / 2 + sin(angle) * ry * wobble);
  }
}

function newVehicle(x, y) {
  const car = new SportCar(x, y, carColors[nextColor++ % carColors.length]);
  car.followPathWeight = Number(document.getElementById('follow-weight').value);
  car.separateWeight = Number(document.getElementById('separate-weight').value);
  vehicles.push(car);
  return car;
}

function setupControls() {
  bindWeight('follow-weight', 'follow-value', 'followPathWeight');
  bindWeight('separate-weight', 'separate-value', 'separateWeight');
  document.getElementById('add-car').addEventListener('click', () => newVehicle(mouseX, mouseY));
  document.getElementById('toggle-debug').addEventListener('change', event => {
    debug = event.target.checked;
    Vehicle.debug = debug;
  });
}

function bindWeight(sliderId, outputId, property) {
  const slider = document.getElementById(sliderId);
  const output = document.getElementById(outputId);
  const update = () => {
    const value = Number(slider.value);
    output.value = value.toFixed(1);
    for (const car of vehicles) car[property] = value;
  };
  slider.addEventListener('input', update);
  update();
}

function keyPressed() {
  if (key === "'" || key === '"') newVehicle(mouseX, mouseY);
  if (key === 'd' || key === 'D') {
    debug = !debug;
    Vehicle.debug = debug;
    document.getElementById('toggle-debug').checked = debug;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  newPath();
}
