let prts = [];
let maxParts = 200;
let spawn = false; // флаг генерации при движении
let k = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function touchStarted() {
  spawn = true; // включаем генерацию
  return false;
}

function touchEnded() {
  spawn = false; // выключаем генерацию
  return false;
}

function mousePressed() {
  spawn = true;
}

function mouseReleased() {
  spawn = false;
}

function draw() {
  background(0, 40);

  // если включён режим генерации — создаём новые круги у курсора
  if (spawn) {
    prts.push(new Part(mouseX, mouseY, random(10, 30)));
  }

  if (prts.length > maxParts) {
    prts.splice(0, prts.length - maxParts);
  }

  for (let p of prts) {
    p.drw();
    p.move();
    p.grow();
    p.split();
  }
}

class Part {
  constructor(x, y, ra) {
    this.x = x;
    this.y = y;
    this.ra = ra;
    this.tx = random(1000);
    this.ty = random(1000);
    this.growthRate = random(0.05, 0.3); // индивидуальная скорость роста
    this.colorShift = random(0.01, 0.05); // индивидуальный сдвиг цвета
  }

  drw() {
    let baseCol = color(
      150 + 100 * sin(frameCount * this.colorShift),
      200 + 55 * cos(frameCount * this.colorShift * 1.5),
      255 * noise(this.tx, this.ty)
    );

    let col2 = lerpColor(baseCol, color(255, 100, 200), 0.5);
    let col3 = lerpColor(baseCol, color(100, 255, 150), 0.3);

    noStroke();
    fill(baseCol, 150);
    ellipse(this.x, this.y, this.ra);

    fill(col2, 120);
    ellipse(this.x, this.y, this.ra * 0.7);

    fill(col3, 90);
    ellipse(this.x, this.y, this.ra * 0.4);
  }

  move() {
    this.x += map(noise(this.tx), 0, 1, -1.5, 1.5);
    this.y += map(noise(this.ty), 0, 1, -1.5, 1.5);
    this.tx += 0.01;
    this.ty += 0.01;
  }

  grow() {
    this.ra += this.growthRate;
  }

  split() {
    if (this.ra > random(40, 70)) {
      prts.push(new Part(this.x, this.y, this.ra * 0.5));
      this.ra *= 0.5;
    }
  }
}