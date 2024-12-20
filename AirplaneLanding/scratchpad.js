function airplane(x_pos, y_pos, rotation = 0) {
    push();
    translate(x_pos, y_pos);
    rotate(rotation);
  
    // text("✈", 0, 0);
      // Main body
      fill('green');
      ellipse(0,0,60,20)
  
      //landing gear
      fill('white');
      stroke('black');
      strokeWeight(2);
      circle(-10,10,8);
      circle(10,10,8);
      // triangle(-8,5,-15,40,8,5);
      // triangle(-8,-5,-15,-40,8,-5)
      // rect(-20, -5, 40, 10);
      
      // Wings
      // triangle(-5, -5, 15, -5, 5, -15);  // Top wing
      // triangle(-5, 5, 15, 5, 5, 15);     // Bottom wing
      
      // // Tail
      // triangle(-20, -5, -15, -10, -20, -10);
  
    pop();
  }