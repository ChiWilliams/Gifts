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
  
  let eyePosition = null;
  let showGrid = true;
  let gridSize = 20;
  
  function setup() {
    createCanvas(800, 600);
    textAlign(CENTER, CENTER);
    textSize(12);
  }
  
  function draw() {
    background(255);
    
    // Draw grid
    if (showGrid) {
      stroke(200);
      strokeWeight(1);
      for (let x = 0; x < width; x += gridSize) {
        line(x, 0, x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        line(0, y, width, y);
      }
    }
    
    // Draw the completed shape
    fill(200, 200, 200);
    noStroke();
    beginShape();
    points.forEach(p => {
      vertex(p.x, p.y);
    });
    endShape(CLOSE);
    
    // Draw the connection lines
    stroke(0);
    strokeWeight(2);
    for (let i = 0; i < points.length; i++) {
      let nextIndex = (i + 1) % points.length;
      line(points[i].x, points[i].y, points[nextIndex].x, points[nextIndex].y);
    }
    
    // Draw points
    stroke(0);
    fill(255);
    points.forEach((p, i) => {
      ellipse(p.x, p.y, 8, 8);
      fill(255, 0, 0);
      text(i + 1, p.x, p.y - 15);
      fill(255);
    });
    
    // Draw eye if placed
    if (eyePosition) {
      // White of eye
      fill(255);
      stroke(0);
      ellipse(eyePosition.x, eyePosition.y, 15, 15);
      // Pupil
      fill(0);
      ellipse(eyePosition.x, eyePosition.y, 5, 5);
      
      // Show relative coordinates
      fill(0);
      noStroke();
      text(`Eye offset from first point: x: ${Math.round(eyePosition.x - points[0].x)}, y: ${Math.round(eyePosition.y - points[0].y)}`,
           width/2, height - 40);
    }
    
    // Show current mouse coordinates
    fill(0);
    noStroke();
    text(`x: ${mouseX}, y: ${mouseY}`, 70, 20);
    
    // Instructions
    text('Click to place eye. Press G to toggle grid. Press R to reset eye position.', width/2, height - 20);
  }
  
  function mousePressed() {
    eyePosition = createVector(mouseX, mouseY);
    
    // Output the relative position to console
    let relX = Math.round(eyePosition.x - points[0].x);
    let relY = Math.round(eyePosition.y - points[0].y);
    console.log(`Eye offset: {x: ${relX}, y: ${relY}}`);
  }
  
  function keyPressed() {
    if (key === 'g' || key === 'G') {
      showGrid = !showGrid;
    }
    if (key === 'r' || key === 'R') {
      eyePosition = null;
    }
  }