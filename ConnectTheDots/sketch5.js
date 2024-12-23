// Points for the elephant (these will be scaled)
const originalPoints = [
    {x: 361, y: 166}, {x: 297, y: 216}, {x: 263, y: 295},
    {x: 281, y: 368}, {x: 355, y: 411}, {x: 428, y: 426},
    {x: 515, y: 419}, {x: 523, y: 359}, {x: 537, y: 411},
    {x: 580, y: 393}, {x: 613, y: 346}, {x: 649, y: 285},
    {x: 655, y: 237}, {x: 661, y: 188}, {x: 656, y: 136},
    {x: 623, y: 105}, {x: 592, y: 125}, {x: 613, y: 143},
    {x: 623, y: 173}, {x: 631, y: 226}, {x: 604, y: 279},
    {x: 566, y: 305}, {x: 537, y: 255}, {x: 510, y: 205},
    {x: 461, y: 172}
  ];
  
  let points = [];
  let currentPoint = 0;
  let isDragging = false;
  let dragStart = null;
  let dragEnd = null;
  let completedLines = [];
  let isDrawingComplete = false;
  let POINT_RADIUS = 15; // Will be adjusted in setup
  let screenScale = 1;
  
  // Save button properties
  const BUTTON_WIDTH = 120;
  const BUTTON_HEIGHT = 40;
  const BUTTON_PADDING = 20;
  
  let zoomLevel = 1;
  let panX = 0;
  let panY = 0;
  let lastPinchDistance = 0;
  
  function setup() {
    // Make canvas fill the screen while maintaining aspect ratio
    let targetWidth = min(windowWidth * 0.95, 1200); // Max width of 1200px
    currentScale = targetWidth / 800; // Calculate scale based on original 800px width
    
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
    
    // Apply zoom and pan
    push();
    translate(width/2, height/2);
    scale(zoomLevel);
    translate(-width/2 + panX, -height/2 + panY);
    
    // Draw points
    for (let i = 0; i < points.length; i++) {
      fill(i === currentPoint ? '#4CAF50' : '#2196F3');
      noStroke();
      circle(points[i].x, points[i].y, POINT_RADIUS * 2);
      
      fill(255);
      textAlign(CENTER, CENTER);
      text(i + 1, points[i].x, points[i].y);
    }
    
    // Draw completed lines
    stroke(0);
    strokeWeight(2);
    for (let stroke of completedLines) {
      line(stroke.start.x, stroke.start.y, stroke.end.x, stroke.end.y);
    }
    
    // Draw current drag line
    if (isDragging && dragStart && dragEnd) {
      stroke(0, 150, 0);
      line(dragStart.x, dragStart.y, dragEnd.x, dragEnd.y);
    }
    
    pop();
    
    // Draw save button (after pop() to keep it fixed on screen)
    drawSaveButton();
  }
  
  function drawSaveButton() {
    if (!isDrawingComplete) return;
    
    const buttonX = width - BUTTON_WIDTH - BUTTON_PADDING;
    const buttonY = BUTTON_PADDING;
    
    push();
    // Reset transform for UI elements
    resetMatrix();
    
    // Draw button
    fill(0, 150, 0);
    rect(buttonX, buttonY, BUTTON_WIDTH, BUTTON_HEIGHT, 5);
    
    // Draw text
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    text('Save', buttonX + BUTTON_WIDTH/2, buttonY + BUTTON_HEIGHT/2);
    pop();
  }
  
  function checkSaveButton(x, y) {
    if (!isDrawingComplete) return false;
    
    const buttonX = width - BUTTON_WIDTH - BUTTON_PADDING;
    const buttonY = BUTTON_PADDING;
    
    return x >= buttonX && x <= buttonX + BUTTON_WIDTH &&
           y >= buttonY && y <= buttonY + BUTTON_HEIGHT;
  }
  
  function saveDrawing() {
    saveCanvas('my-elephant', 'png');
  }
  
  function handleStart(x, y) {
    if (checkSaveButton(x, y)) {
      saveDrawing();
      return;
    }
    
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
  
  function mousePressed() {
    // Transform mouse coordinates based on zoom and pan
    let transformedX = (mouseX - width/2)/zoomLevel + width/2 - panX;
    let transformedY = (mouseY - height/2)/zoomLevel + height/2 - panY;
    handleStart(transformedX, transformedY);
  }
  
  function mouseDragged() {
    let transformedX = (mouseX - width/2)/zoomLevel + width/2 - panX;
    let transformedY = (mouseY - height/2)/zoomLevel + height/2 - panY;
    handleMove(transformedX, transformedY);
  }
  
  function mouseReleased() {
    let transformedX = (mouseX - width/2)/zoomLevel + width/2 - panX;
    let transformedY = (mouseY - height/2)/zoomLevel + height/2 - panY;
    handleEnd(transformedX, transformedY);
  }
  
  function touchStarted() {
    if (touches.length === 1) {
      // Single touch for drawing
      let transformedX = (touches[0].x - width/2)/zoomLevel + width/2 - panX;
      let transformedY = (touches[0].y - height/2)/zoomLevel + height/2 - panY;
      handleStart(transformedX, transformedY);
    } else if (touches.length === 2) {
      // Two finger touch for zooming
      lastPinchDistance = dist(touches[0].x, touches[0].y, touches[1].x, touches[1].y);
    }
    return false;
  }
  
  function touchMoved() {
    if (touches.length === 1 && isDragging) {
      // Single touch movement for drawing
      let transformedX = (touches[0].x - width/2)/zoomLevel + width/2 - panX;
      let transformedY = (touches[0].y - height/2)/zoomLevel + height/2 - panY;
      handleMove(transformedX, transformedY);
    } else if (touches.length === 2) {
      // Two finger movement for zooming/panning
      let newPinchDistance = dist(touches[0].x, touches[0].y, touches[1].x, touches[1].y);
      let zoomChange = (newPinchDistance - lastPinchDistance) * 0.01;
      zoomLevel = constrain(zoomLevel + zoomChange, 0.5, 3.0);
      lastPinchDistance = newPinchDistance;
      
      // Calculate midpoint for panning
      let midX = (touches[0].x + touches[1].x) / 2;
      let midY = (touches[0].y + touches[1].y) / 2;
      panX += (midX - pmouseX) * 0.5;
      panY += (midY - pmouseY) * 0.5;
    }
    return false;
  }
  
  function touchEnded() {
    if (touches.length === 0 && isDragging) {
      // Only handle drawing completion if we were dragging
      let transformedX = (dragEnd.x - width/2)/zoomLevel + width/2 - panX;
      let transformedY = (dragEnd.y - height/2)/zoomLevel + height/2 - panY;
      handleEnd(transformedX, transformedY);
    }
    return false;
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