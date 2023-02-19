
let screenWidth = 400;
let screenHeight = 400;
let offset = 10;
let step = 5;
let path = [];
let solution = [];
let timeToMove = 1;
let timerFrames = 1;
let timer2Frames = 60;
let timer2Count = 0;
let countdown = true;
let moves = 0;
let restartSameMapButton;
let restartDiffMapButton;
let frameSlider;
let button4x4;
let button8x8;
let button16x16;
let button40x40;
let smarterAIButton1;
let smarterAIButton2;
let smarter = "no";
let playSmarter = false;
class Tile{
  constructor({position, open}){
    this.position = position;
    this.open = open;
  }
  draw(){
    if(this.open){
      fill(240);
    }
    else{
      fill(0);
    }
    rect(this.position.x, this.position.y, offset - step, offset - step);
  }
}

class Goal{
  constructor({position}){
    this.position = position;
  }
  draw(){
    fill(255, 204, 0);
    rect(this.position.x, this.position.y, offset - step, offset - step);
  }
}

class BoardInitialization{
  constructor({position, onEdge}){
    this.position = position;
    this.onEdge = onEdge;
    this.finished = false;
    this.moveHorizontal = false;
  }
  draw(){
    //rect(this.position.x, this.position.y, 10, 10);
  }
  moveDown(){
    if(this.GetBottomAdjacent() != null){
      this.position.y += offset;
      this.GetBottomAdjacent().open = true;
    }
    else{
      this.move();
      return;
    }
  }
  move(){
    let nums = [0,1,2,3];
    let rand = random(nums);
    if(this.finished){
      return;
    }
    else if(this.onEdge){
      //move down
      if(this.GetBottomAdjacent() != null){
        this.GetBottomAdjacent().open = true;
        this.position.y += offset;
        this.onEdge = true;
      }
      else{
        this.finished = true;
        return;
      }
    }
    else{
    // 0: left 1: right 2: bottom 3: top
    while(((rand == 1 && this.lastPos == 0) || 
    (rand == 0 && this.lastPos == 1) || 
    (rand == 2 && this.lastPos == 3) || 
    (rand == 3 && this.lastPos == 2)) || 
    (this.position.x == 0 && rand == 0) ||
    (this.position.y == 0 && rand == 3) ||
    (this.position.x == screenWidth - offset && rand == 1)||
    (this.position.y == screenHeight - offset && rand == 2)||
    ((this.moveHorizontal && rand) == 2 || (this.moveHorizontal && rand == 3))||
    ((!this.moveHorizontal && rand == 0) || (!this.moveHorizontal && rand == 1))){
      rand = random(nums);
    }
    let count = 0;
    while(count < 2 || ((this.GetLeftAdjacent() == null && this.GetRightAdjacent() == null && this.GetBottomAdjacent() == null && this.GetTopAdjacent() == null))){
      while((this.position.x == 0 && rand == 0) ||
      (this.position.y == 0 && rand == 3) ||
      (this.position.x == screenWidth - offset && rand == 1)||
      (this.position.y == screenHeight - offset && rand == 2)||
      (this.GetRightAdjacent() == null && rand == 1)||
      (this.GetLeftAdjacent() == null && rand == 0)||
      (this.GetTopAdjacent() == null && rand == 3)||
      (this.GetBottomAdjacent() == null && rand == 2)){
        rand = random(nums);
      }
    switch(rand){
      case 0:
        if(this.GetLeftAdjacent() != null){
          this.GetLeftAdjacent().open = true;
          this.position.x -= offset;
          //check if edge, if so, on edge
          //else nothing
        }
        else{
          this.move();
          return;
        }
        this.lastPos = 0;
        this.moveHorizontal = false;
        //else if check if its on the edge
        //else reset to spawn
        break;
      case 1:
        //move right
        if(this.GetRightAdjacent() != null){
          this.GetRightAdjacent().open = true;
          this.position.x += offset;
          //check if touching edge
          //if so: move down until bottom right square is reached, then stop
          if(this.position.x == (screenWidth - offset)){
            this.onEdge = true;
            if(count == 0){
              count++;
            }
          }
        }
        else{
          this.move();
          return;
        }
        this.lastPos = 1;
        this.moveHorizontal = false;
        break;
      case 2:
        //move down
        if(this.GetBottomAdjacent() != null){
          this.GetBottomAdjacent().open = true;
          this.position.y += offset;
        }
        else{
          this.move();
          return;
        }
        this.lastPos = 2;
        this.moveHorizontal = true;
        break;
      case 3:
        //move up
        if(this.GetTopAdjacent() != null){
          this.GetTopAdjacent().open = true;
          this.position.y -= offset;
        }
        else{
          this.move();
          return;
        }
        this.lastPos = 3;
        this.moveHorizontal = true;
        break;
    }
    count++;
  }
}
}
GetLeftAdjacent(){
  let t = null;
  path.forEach(tile => {
    if(tile.position.x == this.position.x && tile.position.y == this.position.y){
      t = tile;
    }
  });
  return t;
}
GetRightAdjacent(){
  let t = null;
  path.forEach(tile => {
    if(tile.position.x == this.position.x&& tile.position.y == this.position.y){
      t = tile;
    }
  });
  return t;
}
GetBottomAdjacent(){
  let t = null;
  path.forEach(tile => {
    if(tile.position.y == this.position.y && tile.position.x == this.position.x){
      t = tile;
    }
  });
  return t;
}
GetTopAdjacent(){
  let t = null;
  path.forEach(tile => {
    if(tile.position.y == this.position.y && tile.position.x == this.position.x){
      t = tile;
    }
  });
  return t;
}
}
class Runner
{
  
  constructor({position}){
    this.position = position;
    this.lastPos = null;
    this.canMove = true;
  }
  move(){
    let nums = [0,1,2,3];
    let rand = random(nums);


    // 0: left 1: right 2: bottom 3: top
    if(!this.canMove){
      return;
    }
    while(((rand == 1 && this.lastPos == 0) || 
    (rand == 0 && this.lastPos == 1) || 
    (rand == 2 && this.lastPos == 3) || 
    (rand == 3 && this.lastPos == 2)) || 
    (this.position.x == 0 && rand == 0) ||
    (this.position.y == 0 && rand == 3) ||
    (this.position.x == screenWidth - offset && rand == 1)||
    (this.position.y == screenHeight - offset && rand == 2)){
      rand = random(nums);
    }
    console.log(rand == 0 ? "left" : rand == 1 ? "right" : rand == 2 ? "bottom" : rand == 3 ? "top" : "null");
    switch(rand){
      case 0:
        //move left
        //check if left square is open
        //if it is, move there
        //otherwise, reset to corner
        if(this.GetLeftAdjacent() != null){
          if(this.GetLeftAdjacent().open){
            this.position.x -= offset;
            moves++;
            if(playSmarter){
              this.lastPos = 0;
            }
          }
          if(!playSmarter)
            this.lastPos = 0;
        }
        break;
      case 1:
        //move right
        if(this.GetRightAdjacent() != null){
          if(this.GetRightAdjacent().open){
          this.position.x += offset;
          moves++;
          if(playSmarter){
           this.lastPos = 1;
          }
          }
          if(!playSmarter){
            this.lastPos = 1;
          }
        }
        break;
      case 2:
        //move down
        if(this.GetBottomAdjacent() != null){
          if(this.GetBottomAdjacent().open){
          this.position.y += offset;
          moves++;
          if(playSmarter){
            this.lastPos = 2;
          }
          }
        }
        if(!playSmarter){
          this.lastPos = 2;
        }
        break;
      case 3:
        //move up
        if(this.GetTopAdjacent() != null){
          if(this.GetTopAdjacent().open){
          this.position.y -= offset;
          moves++;
          if(playSmarter){
            this.lastPos = 3;
          }
          }
        }
        if(!playSmarter){
          this.lastPos = 3;
        }
        break;
    }
}



  draw(){
    fill(0,255,0);
    rect(this.position.x, this.position.y, offset - step, offset - step);
  }
  GetLeftAdjacent(){
    let t = null;
    path.forEach(tile => {
      if(tile.position.x == this.position.x - offset && tile.position.y == this.position.y){
        t = tile;
      }
    });
    return t;
  }
  GetRightAdjacent(){
    let t = null;
    path.forEach(tile => {
      if(tile.position.x == this.position.x + offset && tile.position.y == this.position.y){
        t = tile;
      }
    });
    return t;
  }
  GetBottomAdjacent(){
    let t = null;
    path.forEach(tile => {
      if(tile.position.y == this.position.y + offset && tile.position.x == this.position.x){
        t = tile;
      }
    });
    return t;
  }
  GetTopAdjacent(){
    let t = null;
    path.forEach(tile => {
      if(tile.position.y == this.position.y - offset && tile.position.x == this.position.x){
        t = tile;
      }
    });
    return t;
  }
  reset(){
    runner = new Runner(
      {
        position: {x: 0, y: 0},
      });
  }
}
let runner = new Runner(
  {
    position: {x: 0, y: 0},
  });
let goal;

let boardInit = new BoardInitialization(
  {
    position: {x: 0, y: 0},
    onEdge: false,
  });
  function buttonInit(){
    button4x4 = createButton('4x4');
    button8x8 = createButton('8x8');
    button16x16 = createButton('16x16');
    button40x40 = createButton('40x40');
    button4x4.position(800, 100);
    button8x8.position(855, 100);
    button16x16.position(910, 100);
    button40x40.position(965, 100);
    button4x4.size(50,50);
    button8x8.size(50,50);
    button16x16.size(50,50);
    button40x40.size(50,50);
    smarterAIButton1 = createButton('no');
    smarterAIButton2 = createButton('yes');
    smarterAIButton1.position(850,250);
    smarterAIButton2.position(950, 250);
    smarterAIButton1.size(50,50);
    smarterAIButton2.size(50,50);
    smarterAIButton1.mousePressed(() => 
    {
      playSmarter = false;
      smarter = "no";
    });
    smarterAIButton2.mousePressed(() => 
    {
      playSmarter = true;
      smarter = "yes (may get stuck sometimes)";
    });
    button4x4.mousePressed(() =>
    {
      offset = 100;
      resetNewMap();
    });
    button8x8.mousePressed(() =>
    {
      offset = 50;
      resetNewMap();
    });
    button16x16.mousePressed(() =>
    {
      offset = 25;
      resetNewMap();
    });
    button40x40.mousePressed(() =>
    {
      offset = 10;
      resetNewMap();
    });
      restartSameMapButton = createButton('RESET AND KEEP MAP');
      restartSameMapButton.position(75,425);
      restartSameMapButton.size(250, 20);
      restartSameMapButton.mousePressed(resetKeepMap);
      restartDiffMapButton = createButton('RESET AND GENERATE NEW MAP');
      restartDiffMapButton.position(75,475)
      restartDiffMapButton.size(250, 20);
      restartDiffMapButton.mousePressed(resetNewMap);
  }
function setup() {
  createCanvas(screenWidth * 3, screenHeight * 2);
  background(220);
  frameSlider = createSlider(1, 20, 10);
  frameSlider.position(650, 400);
  solution.push();
  buttonInit();
  for(let i = 0; i < screenHeight; i += offset){
    for(let j = 0; j < screenWidth; j += offset){
      path.push(new Tile(
        {
          position: {x: i, y: j},
          open: false,
        }));
    }
  }
  goal = new Goal(
    {
      position: {x: path[path.length - 1].position.x, y:path[path.length - 1].position.y},
    });

}

function resetKeepMap(){
  runner = new Runner(
    {
      position: {x: 0, y: 0},
    });
  runner.canMove = true;
  runner.lastPos = null;
  moves = 0;
  timer2Count = 0;
  countdown = true;
}
function resetNewMap(){
  runner = new Runner(
    {
      position: {x: 0, y: 0},
    });
  runner.canMove = true;
  runner.lastPos = null;

  path.forEach(element => {
    element.open = false;
  });
  path = [];
  boardInit = new BoardInitialization(
    {
      position: {x: 0, y: 0},
      onEdge: false,
    });
  boardInit.finished = false;
  moves = 0;
  timer2Count = 0;
  countdown = true;
  for(let i = 0; i < screenHeight; i += offset){
    for(let j = 0; j < screenWidth; j += offset){
      path.push(new Tile(
        {
          position: {x: i, y: j},
          open: false,
        }));
    }
  }
  goal = new Goal(
    {
      position: {x: path[path.length - 1].position.x, y:path[path.length - 1].position.y},
    });
}

function draw() {
  if(runner.canMove){
    timerFrames = frameSlider.value();
    background(220);
    if(!boardInit.finished){
      for(let i = 0; i < 5; i++)
        boardInit.move();
    }
    if(frameCount % timerFrames == 0 && timeToMove > 0){
      timeToMove--;
    }
    if(frameCount % timer2Frames == 0 && countdown){
      timer2Count++;
    }
    if(timeToMove <= 0){
      timeToMove = 1;
      if(runner.canMove)
        runner.move();
      if(runner.position.x == goal.position.x && runner.position.y == goal.position.y){

        runner.canMove = false;
        countdown = false;
      }
    }
    path.forEach(element => {
      element.draw();
    });
    runner.draw();
    goal.draw();
    boardInit.draw();
    //text
    fill(0);
    textSize(30);
    text("Time: " + timer2Count, 550, 50);
    textSize(30);
    text("Moves: " + moves, 550,100);
    textAlign(CENTER);
    text("Attempt new move every: " + timerFrames + (timerFrames == 1 ? " frame" : " frames"), 700,350);
    text("Select grid size:", 900,50);
    text("Smarter AI: " + smarter, 900, 200);
    fill(255,0,0);
    textSize(100);
      if(!runner.canMove)
        text("Goal Reached!", 750, 250);
  }
  
}