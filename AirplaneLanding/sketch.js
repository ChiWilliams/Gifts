let WIDTH = 800;
let HEIGHT = 500;

let runwayX = WIDTH * 0.4;
let runwayWidth = WIDTH * 0.5;
let runwayY = HEIGHT - 65;

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


    this.gameState = GameState.FLYING;
  }

  show() {
    
    push();
    fill("green");
    translate(this.x, this.y);
    rotate(this.rotation);
    textSize(50);
    text("✈", -25, 17);
    pop();

    push();
    fill("red");
    ellipse(this.x, this.y, 5, 5); // Show actual collision point
    pop();
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

  checkCollision() {
    //runway bounds:
    // Check if plane is over runway
    if (this.x >= runwayX && this.x <= runwayX + runwayWidth) {
      if (this.y >= runwayY) {
        // Landing logic here
        this.y = runwayY;
        // this.verticalSpeed = 0;
        this.speed = 0;
        return CollisionState.RUNWAY;
      }
    } 

    // Check water collision
      else if (this.y >= height - 50) {
        console.log("Water");
        this.speed = 0;
        return CollisionState.WATER;
      }
    return CollisionState.FLYING;
  }

  checkRunwayConditions() {
    console.log("checking runway conditions");
    console.log(this.rotation / Math.PI)
    console.log(this.speed < 5 && Math.abs(this.rotation / Math.PI) < 0.2)
    return this.speed < 5 && Math.abs(this.rotation / Math.PI) < 0.3;
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

  if testPlane.gameState

  testPlane.show();
  testPlane.update();

  // console.log(testPlane.gameState)

  // airplane(200, 200, 0);
}

function keyPressed() {
  if (key === 'w' || key === 'W') {
    testPlane.speed += 0.5;
  } else if (key === 's' || key === 'S') {
    testPlane.speed -= 0.5;
  } else if (key === 'a' || key === 'A') {
    testPlane.rotation -= 0.1;
  } else if (key === 'd' || key === 'D') {
    testPlane.rotation += 0.1;
  }
}
