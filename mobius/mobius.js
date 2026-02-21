// credit: @kevinvennitti

const dim = Math.min(innerHeight, innerWidth);

let angleInc;

let ellipseW, ellipseH;

let angle = 0;
let angleStart = 0;
let canDraw = true;

let mode = true;

let imgLeft, imgRight;

let leftPart, rightPart;

let fill1;
let fill2;
let bg;
//let bg = "#F5F5DC";
//let bg = "#E32227";

function setup() {
  createCanvas(dim, dim);
	
  //pixelDensity(3);
  frameRate(60);
  
  colorMode(HSL, 360, 100, 100);
  
  fill1 = "#0A0A0A";
  fill2 = "#F5F5DC";
  
  bg = color(Math.floor(randomBetween(0, 360)), 80, 50);

  document.body.style.backgroundColor = bg.toString();
	
  ellipseW = width * randomBetween(0.2, 0.35);
  ellipseH = height * randomBetween(0.2, 0.35);
  
  angleInc = 1 * Math.floor(randomBetween(2, 7));
  
  leftPart = createGraphics(width / 2, height);
  rightPart = createGraphics(width / 2, height);

  leftPart.ellipseMode(CENTER);
  rightPart.ellipseMode(CENTER);

  leftPart.noStroke();
  rightPart.noStroke();

  leftPart.background(bg);
  rightPart.background(bg);
	
  //saveGif("opart", 250, {units: "frames", notificationDuration: 1, delay:1})
  //noLoop();
}

function draw() {
	
	
  leftPart.background(bg);
  rightPart.background(bg);
	
  const i = frameCount;

  let t0 = sin(i * 0.025) ** 3 ;
  t0 = map(t0, -1, 1, 0, 1);
	
  canDraw = true;
  angle = angleStart;
  mode = true;
  
  while (canDraw == true) {
    let x = cos(radians(angle)) * width*0.3 + (width*0.5);
    let y = sin(radians(angle)) * height*0.3 + (height*0.5);
    
    let rotation = -radians(angle) * 5;

    if (mode) {
      leftPart.fill(fill1); // E32227 0000FF D822E3(purple)
      rightPart.fill(fill1); // E32227 0000FF D822E3(purple)
    } else {
      leftPart.fill(fill2);
      rightPart.fill(fill2);
    }

    if (angle <= 360) {
      leftPart.push();
      leftPart.translate(x, y);
      leftPart.rotate(rotation);
      leftPart.ellipse(0, 0, ellipseW, ellipseH);
      leftPart.pop();
    }

    if (angle <= 540) {
      rightPart.push();
      rightPart.translate(x - width / 2, y);
      rightPart.rotate(rotation);
      rightPart.ellipse(0, 0, ellipseW, ellipseH);
      rightPart.pop();
    }

    angle += angleInc;
    mode = !mode;
    
    if (angle > 540) {canDraw = false;}
  }

  image(leftPart, 0, 0);
  image(rightPart, width / 2, 0);
  
  angleStart -= lerp(-1, 1, t0 );
}

function mouseClicked() {
  setup();
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}
