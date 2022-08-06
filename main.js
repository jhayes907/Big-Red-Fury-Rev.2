// canvas setup
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 1500;
canvas.height = 800;
const gameAudio = new Audio();
gameAudio.src = 'assets/sounds/penguin_dance.mp3';


let santa;
let penguinTimer = null;
let penguin = {img:null, x:0, y:0, width:28, height:42, currentframe:0, totalframes:8};
let reindeer;
let Health = 100;
let score = 0;;
let gameFrame = 0;
ctx.font = "40px Georgia";
let gameSpeed = 0.5;
let gameOver = false;

// window.addEventListener('DOMContentLoaded', function(){

// })
// mouse interaction
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  click: false,
};

canvas.addEventListener("mousedown", function (event) {
  mouse.click = true;
  mouse.x = event.x - canvasPosition.left;
  mouse.y = event.y - canvasPosition.top;
});

canvas.addEventListener("mouseup", function (event) {
  mouse.click = false;
});



// add sprite image paths
const santaRight = new Image();
santaRight.src = 'assets/Santa-sprites/Idle-(1).png';
const santaLeft = new Image();
santaLeft.src = 'assets/Santa-sprites/Idle-(left).png';
const santaDead = new Image();
santaDead.src = 'assets/Santa-sprites/Dead-(17).png';
const santaDeadLeft = new Image();
santaDeadLeft.src = 'assets/Santa-sprites/Dead-(left).png';
const santaSlide  = new Image();  
santaSlide.src = 'assets/Santa-sprites/Slide-(1).png';
const santaSlideLeft = new Image();
santaSlideLeft.src = 'assets/Santa-sprites/Slide-(left).png';

// Player
class Santa {
  constructor() {
    this.x = canvas.width;
    this.y = canvas.height / 2;
    this.radius = 40;
    this.angle = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;
    this.spriteWidth = 480;
    this.spriteHeight = 544;
  }
  // move Santa to pointer  direction function
  update() {
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    let theta = Math.atan2(dx, dy);
    this.angle = theta;
    if (mouse.x != this.x) {
      this.x -= dx / 20;
    }
    if (mouse.y != this.y) {
      this.y -= dy / 20;
    }
  }
  draw() {
    // Directional lineTo
    if (mouse.click) {
      ctx.lineWidth = 0.1;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }
    
    // ctx.fillStyle = "red";
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // ctx.fill();
    // ctx.closePath();
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    
    
    // added so sprite will face pointer
    // ctx.save();
    // ctx.translate(this.x, this.y);
    // ctx.rotate(this.angle);
    
    if (this.x >= mouse.x + (mouse.click)){
      ctx.drawImage(
        santaLeft, 
        this.frameX * this.spriteWidth, 
        this.frameY, 
        this.spriteHeight, this.spriteWidth,
        //play with this for sprite positioning relative to collision radius 
        this.x - 35, this.y - 44, 
        this.spriteWidth / 2, 
        this.spriteHeight /4); 

    } else {
      ctx.drawImage(
        santaRight, 
        this.frameX * this.spriteWidth, 
        this.frameY , 
        this.spriteHeight, this.spriteWidth,
          //play with this for sprite positioning relative to collision radius 
        this.x - 42, this.y - 43, 
        this.spriteWidth / 2, this.spriteHeight /4);

      }
      ctx.restore();
  }
}

santa = new Santa();

// Baddies
const penguinsArray = [];
// add penguin sprite paths
let penguinImage = new Image();
penguinImage.src = "assets/penguin-sprites/Turn_Around3.png";

class Penguin {
  constructor() {
    this.Image = penguinImage;
    this.x = Math.random() * canvas.width;
    this.y = 0 - 50;
    this.width = 0;
    this.height = 0;
    this.frameX = 480;
    this.frameY = 319;
    this.spriteWidth = 108.4;
    this.spriteHeight = 231;
    // modify these properties for size and speed
    this.radius = 14;
    this.speed = 0.3;
    this.distance;
    this.counted = false;
    // // change to collision kill sound
    this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
  }
  update() {
    this.y += this.speed;
    const dx = this.x - santa.x;
    const dy = this.y - santa.y;
    this.distance = Math.sqrt(dx * dx + dy * dy);
    //   this.y += this.dy;
    //   this.x += this.dx;
  }
  draw() {
    penguinImage.src = "assets/penguin-sprites/Turn_Around3.png";
    ctx.drawImage(
    penguinImage,
    this.x, this.y, this.radius, this.radius,
    this.frameX * this.spriteWidth,
    this.frameY * this.spriteHeight,
    this.spriteWidth,
    this.spriteHeight,
    this.x,
    this.y,
    this.spriteWidth / 4,
    this.spriteHeight / 4);
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
    
  }
}

penguinImage.onload = function(){
  penguinTimer = setInterval(animatePenguin, 120);
}

function animatePenguin() {
  penguin.currentframe++;

  ctx.drawImage(
    penguinImage, 
    penguin.currentframe * penguin.width, 
    0, 
    penguin.width,
    penguin.height,
    0,
    0,
    penguin.width,
    penguin.height);

    if(penguin.currentframe >= penguin.totalframes) {
      penguin.currentframe = 0;
    }
}
// setup path to penguin kill audio effects
const penguinEnd1 = document.createElement('audio');
penguinEnd1.src = 'assets/sounds/penguin_RIP 01.wav';
const penguinEnd2 = document.createElement('audio');
penguinEnd2.src = 'assets/sounds/penguin_RIP 02.wav';

// penguin rendering
function handlePenguins() {
  if (gameFrame % 120 == 0) {
    penguinsArray.push(new Penguin());
  }
  for (let i = 0; i < penguinsArray.length; i++) {
    penguinsArray[i].update();
    penguinsArray[i].draw();
    if (penguinsArray[i].y > canvas.height + penguinsArray[i].radius * 2) {
      penguinsArray.splice(i, 1);
      i--;
    } else if (
      penguinsArray[i].distance <
      penguinsArray[i].radius + santa.radius
     ){
      if (!penguinsArray[i].counted) {
        if (penguinsArray[i].sound == 'sound1'){
        penguinEnd1.play();
        } else {
        penguinEnd2.play();
        }
        score++;
        penguinsArray[i].counted = true;
        // change to dead penguin flash
        penguinsArray.splice(i, 1);
        i--;
      }
    }
  }
  for (let i = 0; i < penguinsArray.length; i++) {}
}

// repeating background code
// const background = new Image();
// background.src = 'background.png';

// const BG = {
//     x1: 0,
//     x2: canvas.width,
//     y: 0,
//     width: canvas.width,
//     height: canvas.height
// }

// Ememies
// const enemyImage = new Image();
// enemyImage.src = '';
// class Enemy {
//   constructor() {
//     this.x = canvas.width + 200;
//     this.y = Math.random() * (canvas.height - 150) + 90;
//     this.radius = 60;
//     this.speed = Math.random() * 2 + 2;
//     this.frame = 0;
//     this.frameX = 0;
//     this.frameY = 0;
//     // this.spriteWidth = ;
//     // this.spriteHeight = ;
//   }
//   draw() {
//     ctx.fillStyle = "red";
//     ctx.beginPath();
//     ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
//     ctx.fill();
//     ctx.stroke();
//     ctx.drawImage(
//       enemyImage,
//       this.frameX * this.spriteWidth,
//       this.frameY * this.spriteHeight,
//       this.spriteWidth,
//       this.spriteHeight,
//       this.x,
//       this.y,
//       this.spriteWidth / 4,
//       this.spriteHeight / 4
//     );
//   }
//   sprite movement animations
//   update() {
//     this.x -= this.speed;
//     if (this.x < 0 - this.radius * 2) {
//       this.x = canvas.width + 200;
//       this.y = Math.random() * (canvas.height - 150) + 90;
//       this.speed = math.random() * 2 + 2;
//     }
//     if (gameFrame % 5 == 0) {
//       this.frame++;
//       if (this.frame >= 12) this.frame = 0;
//       if (this.frame == 3 || this.frame == 7 || this.frame == 11) {
//         this.frameX = 0;
//       } else {
//         this.frameX++;
//       }
//       if (this.frame < 3) this.frameY = 0;
//       else if (this.frame < 7) this.frameY = 1;
//       else if (this.frame < 11) this.frameY = 2;
//       else this.frameY = 0;
//     }
//     // collision detection with Santa
//     const dx = this.x - player.x;
//     const dy = this.y - player.y;
//     const distance = Math.sqrt(dx * dx + dy * dy);
//     if (distance < this.radius + player.radius) {
//       // handleGameOver();
//     }
//   }
//  }
// const enemy1 = new Enemy();
// function handleEnemies(){
//         enemy1.draw();
//         enemy1.update();
// }
let reindeerImage = new Image;
reindeerImage.src = 'assets/Santa-sprites/Santa_and_Sleigh-1.png';
class Reindeer {
  constructor() {
    this.alive = true;
    this.width = 100;
    this.height = 100;
    this.x = canvas.width / 2 - this.width / 2;
    this.y = 10;
    this.reindeerHealth = 0;
  }
}
reindeer = new Reindeer();

function handleReindeer(){

}
// functionhandleGameOver(){
//     ctx.fillStyle = 'white';
//     ctx.fillText('Game Over, you reached score ' + score + 130, 250);
//     gameOver = true;
// }
// //
// animations loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handlePenguins();
  santa.update();
  santa.draw();
  handleReindeer();
  ctx.fillStyle = "red";
  ctx.fillText("Health: " + Health, 1260, 50);
  ctx.fillStyle = "black";
  ctx.fillText("score: " + score, 20, 50);
  gameFrame++;
  if (!gameOver) requestAnimationFrame(animate);
}
animate();

window.addEventListener("resize", function () {
  canvas.getBoundingClientRect();
});
