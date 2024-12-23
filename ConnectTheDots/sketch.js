// Points for the elephant
const points = [
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
  {x: 461, y: 172}, 
];

let currentPoint = 0;  // Track which point we're connecting from
let isDragging = false;
let dragStart = null;
let dragEnd = null;
let completedLines = [];  // Store completed connections
let isDrawingComplete = false;
const POINT_RADIUS = 15;  // Distance to detect if we're near a point

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
  textSize(16);
}

function draw() {
  background(255);
  
  if (isDrawingComplete) {
    // Draw filled shape first
    fill(200, 200, 200);  // Grey fill
    noStroke();
    beginShape();
    points.forEach(p => {
      vertex(p.x, p.y);
    });
    endShape(CLOSE);
    
    // Draw eye
    fill(255);
    stroke(0);
    ellipse(points[0].x + 106, points[0].y + 89, 15, 15);  // Adjust position based on your elephant
    fill(0);
    ellipse(points[0].x + 106, points[0].y + 89, 5, 5);
  }
  
  // Draw completed lines
  stroke(0);
  strokeWeight(2);
  completedLines.forEach(stroke => {
    line(stroke.start.x, stroke.start.y, stroke.end.x, stroke.end.y);
  });
  
  // Draw current drag line if dragging
  if (isDragging && dragStart) {
    stroke(200);
    line(dragStart.x, dragStart.y, dragEnd.x, dragEnd.y);
  }
  
  // Draw points
  for (let i = 0; i < points.length; i++) {
    // Highlight current point
    if (i === currentPoint) {
      fill(200, 200, 255);
    } else if (i < currentPoint || (isDrawingComplete && i === 0)) {
      fill(200, 255, 200);  // Completed points
    } else {
      fill(255);
    }
    
    stroke(0);
    strokeWeight(1);
    ellipse(points[i].x, points[i].y, POINT_RADIUS * 2);
    
    // Draw point numbers
    fill(0);
    noStroke();
    text(i + 1, points[i].x, points[i].y);
  }
  
  // Draw instructions
  fill(0);
  noStroke();
  if (!isDrawingComplete) {
    if (currentPoint === points.length - 1) {
      text('Connect back to point 1 to complete the drawing!', width/2, 30);
    } else {
      text('Connect the dots in order! Drag from one point to the next.', width/2, 30);
    }
  } else {
    fill(0, 150, 0);
    text('Merry Christmas!', width/2, 30);
  }
}

function mousePressed() {
  // Check if we're starting drag from current point
  let d = dist(mouseX, mouseY, points[currentPoint].x, points[currentPoint].y);
  if (d < POINT_RADIUS) {
    isDragging = true;
    dragStart = points[currentPoint];
    dragEnd = {x: mouseX, y: mouseY};
  }
}

function mouseDragged() {
  if (isDragging) {
    dragEnd = {x: mouseX, y: mouseY};
  }
}

function mouseReleased() {
  if (isDragging) {
    if (currentPoint === points.length - 1) {
      // Check if we're connecting back to the first point
      let d = dist(mouseX, mouseY, points[0].x, points[0].y);
      if (d < POINT_RADIUS) {
        // Complete the drawing
        completedLines.push({
          start: {...points[currentPoint]},
          end: {...points[0]}
        });
        isDrawingComplete = true;
      }
    } else {
      // Check if we ended on the next point
      let d = dist(mouseX, mouseY, points[currentPoint + 1].x, points[currentPoint + 1].y);
      if (d < POINT_RADIUS) {
        // Successfully connected to next point
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