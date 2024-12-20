let WIDTH = 800;
let HEIGHT = 500;

let runwayX = WIDTH * 0.4;
let runwayWidth = WIDTH * 0.5;
let runwayY = HEIGHT - 65;

let debug = false;

const GameState = {
  FLYING: "FLYING",
  LANDED: "LANDED",
  CRASHED: "CRASHED"
}

const CollisionState = {
  RUNWAY: "RUNWAY",
  WATER: "WATER",
  FLYING: "FLYING"
}

class PlaneSketch {
  constructor(x_pos, y_pos, rotation=0, speed = 0) {
    this.x = x_pos;
    this.y = y_pos;
    this.rotation = rotation;
    this.speed = speed;

    // this.points = this.createCollisionPoints();

    this.gameState = GameState.FLYING;
  }

  get points() {
    const noseX = this.x + 25 * Math.cos(this.rotation);
    const noseY = this.y + 25 * Math.sin(this.rotation);
    const leftWingX = this.x + 20 * Math.cos(this.rotation - Math.PI* 0.6);
    const leftWingY = this.y + 20 * Math.sin(this.rotation - Math.PI * 0.6);
    const rightWingX = this.x + 20 * Math.cos(this.rotation + Math.PI * 0.6);
    const rightWingY = this.y + 20 * Math.sin(this.rotation + Math.PI * 0.6);

    return [
      {x: noseX, y: noseY},
      {x: leftWingX, y: leftWingY},
      {x: rightWingX, y: rightWingY}
    ];
  }
  show() {
    
    push();
    fill("green");
    translate(this.x, this.y);
    rotate(this.rotation);
    textSize(50);
    text("✈", -25, 17);
    pop();


    if (debug) {
      push();
      fill("red");
      ellipse(this.x, this.y, 5, 5); // Show actual collision point
      pop();
    }

        // Get the plane's collision points (nose and wings)
        

    if (debug) {
      push();
      fill('red');
      const [ tip, leftWing, rightWing ] = this.points;
      ellipse(tip.x, tip.y, 5, 5);
      ellipse(leftWing.x, leftWing.y, 5, 5);
      ellipse(rightWing.x, rightWing.y, 5, 5);
      pop();
    }

  }

  update() {
      if (this.gameState === GameState.FLYING) {
        this.x += this.speed * Math.cos(this.rotation);
        this.y += this.speed * Math.sin(this.rotation);

        let collision = this.checkCollision();
        if (collision === CollisionState.WATER) {
          this.gameState = GameState.CRASHED;
        } else if (collision === CollisionState.RUNWAY) {
          if (this.checkRunwayConditions() === true) {
            this.gameState = GameState.LANDED
          } else {
            this.gameState = GameState.CRASHED
          }
        }
        }
    }


  checkBounds() {
    if (this.x < -10 || this.x > WIDTH + 10 ||
      this.y < -10 || this.y > HEIGHT + 10) {
        this.gameState = GameState.CRASHED;
        return false;
      }
    return true;
  }

  checkCollision() {
    //runway bounds:

    //check plane is in game:
    if (!this.checkBounds()) {
      return CollisionState.WATER; //out-of-bounds is water crash
    }

    for (const point of this.points) {
      if (point.x >= runwayX && point.x <= runwayX + runwayWidth) {
        if (point.y >= runwayY) {
          // Landing logic here
          point.y = runwayY;
          // this.verticalSpeed = 0;
          return CollisionState.RUNWAY;
        }
      } 
  
      // Check water collision
        else if (point.y >= height - 50) {
          return CollisionState.WATER;
        }
    }
    // Check if plane is over runway
    return CollisionState.FLYING;
  }

  checkRunwayConditions() {
    const speedOK = Math.abs(this.speed) < 5;
    const rotationOK = Math.abs(this.rotation % Math.PI) < 0.3;

    if (debug) {
      console.log(`Landing conditions:
        Speed: ${this.speed.toFixed(2)} (${speedOK ? 'OK' : 'Too fast'})
        Rotation: ${Math.abs(this.rotation % Math.PI) }° (${rotationOK ? 'OK' : 'Bad angle'})`);
    }
    return speedOK && rotationOK;
  }
}

function airplaneSketch(x_pos, y_pos) {
  push();
  translate(x_pos, y_pos);
  textSize(50);
  text("✈", 0, 0);
  pop();
}

function drawBackground() {
  background("#99d6f7");
  
  // rectangle of water
  fill("blue")
  rect(0,HEIGHT,WIDTH,-50)
  
  //rectangle of runway
  fill("brown")
  
  rect(runwayX,HEIGHT,runwayWidth,runwayY-HEIGHT);
}



let testPlane = new PlaneSketch(200,200,-0.1,1);

function setup() {
  createCanvas(WIDTH, HEIGHT);
}

function draw() {
  drawBackground();


  testPlane.show();
  testPlane.update();

  // console.log(testPlane.gameState)

  // airplane(200, 200, 0);
}

function keyPressed() {
  switch (key.toLowerCase()) {
    case 'w':
      testPlane.speed += 0.5;
      break;
    case 's': 
      testPlane.speed -= 0.5;
      break;
    case 'a':
      testPlane.rotation -= 0.1;
      break;
    case 'd':
      testPlane.rotation += 0.1;
      break;
    case 't':
      debug = !debug;
  }
}
