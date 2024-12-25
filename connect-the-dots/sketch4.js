// Points for the elephant (these will be scaled)
const originalPoints = [
  {x: 361, y: 166},
  {x: 297, y: 216},
  {x: 263, y: 295},
  {x: 281, y: 368},
  {x: 355, y: 411},
  {x: 428, y: 426},
  {x: 515, y: 419},
  {x: 523, y: 359},
  {x: 537, y: 411},
  {x: 580, y: 393},
  {x: 613, y: 346},
  {x: 649, y: 285},
  {x: 655, y: 237},
  {x: 661, y: 188},
  {x: 656, y: 136},
  {x: 623, y: 105},
  {x: 592, y: 125},
  {x: 613, y: 143},
  {x: 623, y: 173},
  {x: 631, y: 226},
  {x: 604, y: 279},
  {x: 566, y: 305},
  {x: 537, y: 255},
  {x: 510, y: 205},
  {x: 461, y: 172}
];

let points = [];
let currentPoint = 0;
let isDragging = false;
let dragStart = null;
let dragEnd = null;
let completedLines = [];
let isDrawingComplete = false;
let POINT_RADIUS; // Will be set based on screen size
let scale = 1;    // Will be calculated based on screen size

function setup() {
  // Make canvas fill the screen while maintaining aspect ratio
  let targetWidth = min(windowWidth * 0.95, 1200); // Max width of 1200px
  currentScale = targetWidth / 800; // Original width was 800
  
  createCanvas(targetWidth, targetWidth * 0.75); // Maintain 4:3 ratio
  
  // Scale points based on canvas size
  points = originalPoints.map(p => ({
    x: p.x * currentScale,
    y: p.y * currentScale
  }));
  
  // Scale UI elements
  POINT_RADIUS = 15 * currentScale;
  textAlign(CENTER, CENTER);
  textSize(16 * currentScale);
}

function draw() {
  background(255);
  
  if (isDrawingComplete) {
    // Draw filled shape
    fill(200, 200, 200);
    noStroke();
    beginShape();
    points.forEach(p => {
      vertex(p.x, p.y);
    });
    endShape(CLOSE);
    
    // Draw eye (using scaled coordinates)
    fill(255);
    stroke(0);
    let eyeX = points[0].x + (106 * currentScale);
    let eyeY = points[0].y + (89 * currentScale);
    ellipse(eyeX, eyeY, 15 * currentScale, 15 * currentScale);
    fill(0);
    ellipse(eyeX, eyeY, 5 * currentScale, 5 * currentScale);
    
    // Draw save button
    drawSaveButton();
  }
  
  // Draw completed lines
  stroke(0);
  strokeWeight(2 * currentScale);
  completedLines.forEach(stroke => {
    line(stroke.start.x, stroke.start.y, stroke.end.x, stroke.end.y);
  });
  
  // Draw current drag line
  if (isDragging && dragStart) {
    stroke(200);
    line(dragStart.x, dragStart.y, dragEnd.x, dragEnd.y);
  }
  
  // Draw points
  for (let i = 0; i < points.length; i++) {
    if (i === currentPoint) {
      fill(200, 200, 255);
    } else if (i < currentPoint || (isDrawingComplete && i === 0)) {
      fill(200, 255, 200);
    } else {
      fill(255);
    }
    
    stroke(0);
    strokeWeight(1 * currentScale);
    ellipse(points[i].x, points[i].y, POINT_RADIUS * 2);
    
    fill(0);
    noStroke();
    text(i + 1, points[i].x, points[i].y);
  }
  
  // Draw instructions
  fill(0);
  noStroke();
  let instructionY = 30 * currentScale;
  if (!isDrawingComplete) {
    if (currentPoint === points.length - 1) {
      text('Connect back to point 1 to complete the drawing!', width/2, instructionY);
    } else {
      text('Connect the dots in order! Drag from one dot to the next.', width/2, instructionY);
    }
  } else {
    fill(0, 150, 0);
    text('Merry Christmas!', width/2, instructionY);
  }
}

function drawSaveButton() {
  if (isDrawingComplete) {
    let buttonWidth = 120 * currentScale;
    let buttonHeight = 40 * currentScale;
    let buttonX = width - (buttonWidth + 20 * currentScale);
    let buttonY = 20 * currentScale;
    
    // Draw button
    fill(100, 200, 100);
    stroke(0);
    rect(buttonX, buttonY, buttonWidth, buttonHeight, 10 * currentScale);
    
    // Draw text
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    text('Save Image', buttonX + buttonWidth/2, buttonY + buttonHeight/2);
    
    // Store button bounds for click detection
    window.saveButton = {
      x: buttonX,
      y: buttonY,
      width: buttonWidth,
      height: buttonHeight
    };
  }
}

function saveDrawing() {
  saveCanvas('elephant-drawing', 'png');
}

function checkSaveButton(x, y) {
  if (window.saveButton && isDrawingComplete) {
    let b = window.saveButton;
    if (x > b.x && x < b.x + b.width && 
        y > b.y && y < b.y + b.height) {
      saveDrawing();
      return true;
    }
  }
  return false;
}

// Handle both mouse and touch events
function mousePressed() {
  handleStart(mouseX, mouseY);
}

function mouseDragged() {
  handleMove(mouseX, mouseY);
}

function mouseReleased() {
  handleEnd(mouseX, mouseY);
}

function touchStarted() {
  if (touches.length > 0) {
    handleStart(touches[0].x, touches[0].y);
  }
  return false; // Prevent default
}

function touchMoved() {
  if (touches.length > 0) {
    handleMove(touches[0].x, touches[0].y);
  }
  return false; // Prevent default
}

function touchEnded() {
  // Use the last known dragEnd position since touches array will be empty
  if (dragEnd) {
    handleEnd(dragEnd.x, dragEnd.y);
  }
  return false; // Prevent default
}

// Unified event handlers
function handleStart(x, y) {
  if (checkSaveButton(x, y)) return;
  
  // Reset dragging state
  isDragging = false;
  dragStart = null;
  dragEnd = null;
  
  let d = dist(x, y, points[currentPoint].x, points[currentPoint].y);
  if (d < POINT_RADIUS) {
    isDragging = true;
    dragStart = points[currentPoint];
    dragEnd = {x: x, y: y};
  }
}

function handleMove(x, y) {
  if (isDragging) {
    dragEnd = {x: x, y: y};
  }
}

function handleEnd(x, y) {
  if (isDragging) {
    if (currentPoint === points.length - 1) {
      let d = dist(x, y, points[0].x, points[0].y);
      if (d < POINT_RADIUS) {
        completedLines.push({
          start: {...points[currentPoint]},
          end: {...points[0]}
        });
        isDrawingComplete = true;
      }
    } else {
      let d = dist(x, y, points[currentPoint + 1].x, points[currentPoint + 1].y);
      if (d < POINT_RADIUS) {
        completedLines.push({
          start: {...points[currentPoint]},
          end: {...points[currentPoint + 1]}
        });
        currentPoint++;
      }
    }
    isDragging = false;
    dragStart = null;
    dragEnd = null;
  }
}

// Handle window resizing
function windowResized() {
  let targetWidth = min(windowWidth * 0.95, 1200);
  currentScale = targetWidth / 800;
  resizeCanvas(targetWidth, targetWidth * 0.75);
  
  // Rescale points
  points = originalPoints.map(p => ({
    x: p.x * currentScale,
    y: p.y * currentScale
  }));
  
  // Rescale UI elements
  POINT_RADIUS = 15 * currentScale;
  textSize(16 * currentScale);
  
  // Rescale completed lines
  let oldCompletedLines = [...completedLines];
  completedLines = [];
  oldCompletedLines.forEach(line => {
    let startIndex = points.findIndex(p => 
      p.x === line.start.x / currentScale * currentScale && 
      p.y === line.start.y / currentScale * currentScale
    );
    let endIndex = points.findIndex(p => 
      p.x === line.end.x / currentScale * currentScale && 
      p.y === line.end.y / currentScale * currentScale
    );
    if (startIndex !== -1 && endIndex !== -1) {
      completedLines.push({
        start: {...points[startIndex]},
        end: {...points[endIndex]}
      });
    }
  });
}