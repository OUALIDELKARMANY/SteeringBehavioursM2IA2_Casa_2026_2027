import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

class Vector {
  constructor(x = 0, y = 0) { this.x = x; this.y = y; }
  copy() { return new Vector(this.x, this.y); }
  add(v, y) { if (typeof v === 'number') { this.x += v; this.y += y; } else { this.x += v.x; this.y += v.y; } return this; }
  sub(v) { this.x -= v.x; this.y -= v.y; return this; }
  mult(n) { this.x *= n; this.y *= n; return this; }
  div(n) { this.x /= n; this.y /= n; return this; }
  magSq() { return this.x * this.x + this.y * this.y; }
  mag() { return Math.sqrt(this.magSq()); }
  normalize() { const m = this.mag(); if (m) this.div(m); return this; }
  setMag(n) { return this.normalize().mult(n); }
  limit(n) { if (this.magSq() > n * n) this.setMag(n); return this; }
  heading() { return Math.atan2(this.y, this.x); }
  dot(v) { return this.x * v.x + this.y * v.y; }
  static sub(a, b) { return new Vector(a.x - b.x, a.y - b.y); }
  static add(a, b) { return new Vector(a.x + b.x, a.y + b.y); }
  static dist(a, b) { return Vector.sub(a, b).mag(); }
}

const context = {
  createVector: (x, y) => new Vector(x, y), p5: { Vector },
  random: (a, b) => b === undefined ? a * 0.5 : (a + b) / 2,
  PI: Math.PI, cos: Math.cos, sin: Math.sin, min: Math.min, max: Math.max,
  debug: false, width: 800, height: 600,
};
vm.createContext(context);
for (const file of ['vehicle.js', 'SportCar.js']) {
  vm.runInContext(fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'), context);
}
const { SportCar, Vehicle } = vm.runInContext('({ SportCar, Vehicle })', context);

function pathFixture() {
  return { radius: 5, points: [new Vector(0, 0), new Vector(400, 0), new Vector(400, 400)] };
}

test('SportCar est une Vehicle avec des poids réglables', () => {
  const car = new SportCar(100, 80, 'red');
  assert.ok(car instanceof Vehicle);
  assert.equal(car.followPathWeight, 2);
  assert.equal(car.separateWeight, 1.2);
  car.followPathWeight = 0.5;
  car.separateWeight = 3;
  assert.equal(car.followPathWeight, 0.5);
  assert.equal(car.separateWeight, 3);
});

test('les poids zéro désactivent le steering correspondant', () => {
  const car = new SportCar(150, 100);
  const neighbor = new SportCar(151, 100);
  car.followPathWeight = 0;
  car.separateWeight = 0;
  car.applyBehaviors([car, neighbor], pathFixture());
  assert.equal(car.acc.mag(), 0);
});

test('la force composée reste bornée par maxForce', () => {
  const car = new SportCar(100, 150);
  const neighbor = new SportCar(101, 150);
  car.followPathWeight = 5;
  car.separateWeight = 5;
  car.applyBehaviors([car, neighbor], pathFixture());
  assert.ok(car.acc.mag() <= car.maxForce + 1e-9);
});
