let WIDTH = 800;
let HEIGHT = 600;

let runwayX = WIDTH * 0.4;
let runwayWidth = WIDTH * 0.5;
let runwayY = HEIGHT - 65;

let debug = false;

const GameScreenState = {
  START_SCREEN: "START_SCREEN",
  PLAYING: "PLAYING",
  WIN_SCREEN: "WIN_SCREEN",
  CRASH_SCREEN: "CRASH_SCREEN",
}

class Game {
  constructor () {
    this.gameState = GameScreenState.START_SCREEN;
    this.plane = null;
    this.startTime = null;
    this.elapsedTime = 0;
  }

  reset() {
    this.plane = new PlaneSketch(200, 200, -0.1, 0);
    this.startTime = millis();
    this.elapsedTime = 0;
  }

  update() {
    if (this.gameState === GameScreenState.PLAYING) {
      this.plane.update();
      this.elapsedTime = (millis() - this.startTime) / 1000;
      
      // Check for win/lose conditions
      if (this.plane.gameState === GameState.LANDED) {
        this.gameState = GameScreenState.WIN_SCREEN;
      } else if (this.plane.gameState === GameState.CRASHED) {
        this.gameState = GameScreenState.CRASH_SCREEN;
      }
    }
  }

  draw() {
    switch (this.gameState) {
      case GameScreenState.START_SCREEN:
        this.drawStartScreen();
        break;
      case GameScreenState.PLAYING:
        this.drawGame();
        break;
      case GameScreenState.WIN_SCREEN:
        this.drawWinScreen();
        break;
      case GameScreenState.CRASH_SCREEN:
        this.drawCrashScreen();
        break;
    }
  }

  drawStartScreen() {
    background("#99d6f7");
    textAlign(CENTER, CENTER);
    textSize(48);
    fill(0);
    text("Plane Landing Game", WIDTH/2, HEIGHT/3);
    textSize(24);
    text("Press SPACE to start", WIDTH/2, HEIGHT/2);
    text("Use W/S to control speed", WIDTH/2, HEIGHT/2 + 40);
    text("Use A/D to rotate", WIDTH/2, HEIGHT/2 + 70);
  }

  drawGame() {
    drawBackground();
    this.plane.show();

    textAlign(LEFT, TOP);
    textSize(20);
    fill(0);
    text(`Time: ${this.elapsedTime.toFixed(1)}s`, 10, 10);
  }

  drawWinScreen() {
    textAlign(CENTER, CENTER);
    textSize(48);
    fill(0);
    text("Perfect Landing!", WIDTH/2, HEIGHT/3);
    textSize(24);
    text(`Time: ${this.elapsedTime.toFixed(1)} seconds`, WIDTH/2, HEIGHT/2);
    text("Press SPACE to play again", WIDTH/2, HEIGHT*2/3);
  }

  drawCrashScreen() {
    textAlign(CENTER, CENTER);
    textSize(48);
    fill(0);
    text("Crash!", WIDTH/2, HEIGHT/3);
    textSize(24);
    text("Press SPACE to try again", WIDTH/2, HEIGHT/2);
  }

  handleKeyPress(key) {
    if (key === ' ') {
      console.log("In the if statement")
      console.log(this.gameState)
      if (this.gameState === GameScreenState.START_SCREEN ||
          this.gameState === GameScreenState.WIN_SCREEN ||
          this.gameState === GameScreenState.CRASH_SCREEN) {
        this.gameState = GameScreenState.PLAYING;
        console.log("in this statement")
        this.reset();
      }
      return;
    }

    if (this.gameState === GameScreenState.PLAYING) {
      switch (key.toLowerCase()) {
        case 'w':
          this.plane.speed += 0.5;
          break;
        case 's':
          this.plane.speed -= 0.5;
          break;
        case 'a':
          this.plane.rotation -= 0.1;
          break;
        case 'd':
          this.plane.rotation += 0.1;
          break;
        case 't':
          debug = !debug;
          break;
      }
    }
  }

}

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
    text("✈", -24, -23);
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

let game; 

function setup() {
  createCanvas(WIDTH, HEIGHT);
  game = new Game();
}

function draw() {
  game.update();
  game.draw();

  
  // drawBackground();


  // testPlane.show();
  // testPlane.update();

  // console.log(testPlane.gameState)

  // airplane(200, 200, 0);
}

function keyPressed() {
  game.handleKeyPress(key);
}
