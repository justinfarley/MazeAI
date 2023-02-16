class MathBox{
  
  constructor({text})
  {
    this.text = text
  }
  drawText(){
    fill(0);
    textSize(64);
    text(buttonBox.text);
  }
}

class Calculator
{
  constructor({buttonsRect}){
    this.buttonsRect = buttonsRect; 
  }
}

let buttonrects = 
[
  ["1",200,200],
  ["2",300,200],
  ["3",400,200],
  ["4",200,300],  
  ["5",300,300],
  ["6",400,300],
  ["7",200,400],
  ["8",300,400],
  ["9",400,400],
  ["0",300,500],

]
let calc = new Calculator(
  {
    buttonsRect: buttonrects,

  });
let buttonBox = new MathBox(
  {
    text: "",
  })

function buttonClicked(num){
  buttonBox.text += num.toString();
  buttonBox.drawText();
}
function makeNumberButtons(){
  console.log(calc.buttonsRect.length);
  for(let i = 0; i < calc.buttonsRect.length; i++)
  {
    let newButton = createButton(calc.buttonsRect[i][0]);
    newButton.position(calc.buttonsRect[i][1], calc.buttonsRect[i][2]);
    newButton.style('background-color', color(255, 87, 51, 255));
    newButton.size(100,100);  
    newButton.mousePressed(() => {buttonClicked(parseInt(calc.buttonsRect[i][0]))});
  }
}
function makeMathBox(){
  fill(color(169,169,169));
  rect(193,20,300, 150);
}
function setup() {
  createCanvas(800,800);
  background(0);
  makeNumberButtons();
  makeMathBox();
}

function draw() {
}
