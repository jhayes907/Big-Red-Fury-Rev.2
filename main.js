// canvas setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 1500;
canvas.height = 800;




let santa;
let penguinTimer = null;
let penguin;
let reindeer;
let health = 100;
let score = 0;
let gameFrame = 0;
ctx.font = '40px Georgia';
let gameSpeed = 0.5;
let gameAudio = true;
let gameOver = false;
let youWin = false;

const audio3 = document.getElementById('soundtrack');




// mouse interaction
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  click: false,
};

canvas.addEventListener('mousedown', function (event) {
  mouse.click = true;
  mouse.x = event.x - canvasPosition.left;
  mouse.y = event.y - canvasPosition.top;
  playMusic();
  audio3.volume = .2
  
});

canvas.addEventListener('mouseup', function (event) {
  mouse.click = false;
});

// add sprite image paths
const santaRight = new Image();
santaRight.src = 'assets/Santa-sprites/Idle-(1).png';
const santaLeft = new Image();
santaLeft.src = 'assets/Santa-sprites/Idle-(left).png';
// const santaDead = new Image();
// santaDead.src = 'assets/Santa-sprites/Dead-(17).png';
// const santaDeadLeft = new Image();
// santaDeadLeft.src = 'assets/Santa-sprites/Dead-(left).png';
// const santaSlide  = new Image();
// santaSlide.src = 'assets/Santa-sprites/Slide-(1).png';
// const santaSlideLeft = new Image();
// santaSlideLeft.src = 'assets/Santa-sprites/Slide-(left).png';

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
      ctx.lineWidth = 0.3;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }

    // ctx.fillStyle = "red";
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // ctx.fill();
    // ctx.stroke();

    // added so sprite will face pointer
    // ctx.save();
    // ctx.translate(this.x, this.y);
    // ctx.rotate(this.angle);

    if (this.x >= mouse.x + mouse.click) {
      ctx.drawImage(
        santaLeft,
        this.frameX * this.spriteWidth,
        this.frameY,
        this.spriteHeight,
        this.spriteWidth,
        //play with this for sprite positioning relative to collision radius
        this.x - 35,
        this.y - 44,
        this.spriteWidth / 2,
        this.spriteHeight / 4
      );
    } else {
      ctx.drawImage(
        santaRight,
        this.frameX * this.spriteWidth,
        this.frameY,
        this.spriteHeight,
        this.spriteWidth,
        //play with this for sprite positioning relative to collision radius
        this.x - 42,
        this.y - 43,
        this.spriteWidth / 2,
        this.spriteHeight / 4
      );
    }
    ctx.restore();
  }
}

santa = new Santa();

// Baddies
const penguinsArray = [];
// add penguin sprite paths
let penguinImage = new Image();
penguinImage.src = 'assets/penguin-sprites/Turn_Around3.png';

class Penguin {
  constructor() {
    this.Image = penguinImage;
    this.x = Math.random() * canvas.width;
    this.y = -50;
    // this.width = 0;
    // this.height = 0;
    this.frameX = 1;
    this.frameY = 8;
    this.spriteWidth = 108.4;
    this.spriteHeight = 231;
    // modify these properties for size and speed
    this.radius = 16;
    this.speed = 1;
    this.distance;
    this.counted = false;
    this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
  }
  update() {
    this.y += this.speed;
    const dx = this.x - santa.x;
    const dy = this.y - santa.y;
    this.distance = Math.sqrt(dx * dx + dy * dy);
        // this.y += this.dy;
        // this.x += this.dx;
  }
  draw() {
    // ctx.fillStyle = 'black';
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // ctx.fill();
    // ctx.closePath();
    // ctx.stroke();

    ctx.drawImage(
      penguinImage,
      this.frameX * this.spriteWidth,
      this.frameY,
      this.spriteWidth,
      this.spriteHeight,
      this.x - 13,
      this.y - 23,
      this.spriteWidth / 4,
      this.spriteHeight / 4.5);
  }
}

// penguinImage.onload = function(){
//   penguinTimer = setInterval(animatePenguin, 120);
// }

// function animatePenguin() {
//   penguin.currentframe++;

//   ctx.drawImage(
//     penguinImage,
//     penguin.currentframe * penguin.width,
//     0,
//     penguin.width,
//     penguin.height,
//     0,
//     0,
//     penguin.width,
//     penguin.height);

//     if(penguin.currentframe >= penguin.totalframes) {
//       penguin.currentframe = 0;
//     }
// }
// animatePenguin();

// setup path to penguin kill audio effects
const penguinEnd1 = document.createElement('audio');
penguinEnd1.src = 'assets/sounds/penguin_RIP01.wav';
const penguinEnd2 = document.createElement("audio");
penguinEnd2.src = 'assets/sounds/penguin_RIP02.wav';

// penguin rendering and hit testing
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
      health -= 10;
      if (health == 0) {
        handleGameOver();
      }
    } else if (
      penguinsArray[i].distance < penguinsArray[i].radius + santa.radius
    ) {
      if (!penguinsArray[i].counted) {
        if (penguinsArray[i].sound == 'sound1') {
          penguinEnd1.play();
        } else {
          penguinEnd2.play();
        }
        score += 10;
      }
      penguinsArray[i].counted = true;
      // change to dead penguin flash
      penguinsArray.splice(i, 1);
      i--;

      if(score == 500 && health > 0) {
        handleYouWin();
      }
    }
  }
  for (let i = 0; i < penguinsArray.length; i++) {}
}

// Ememies

const bearGrowl1 = document.createElement('audio');
bearGrowl1.src = 'assets/sounds/bear_01.ogg';
const bearGrowl2 = document.createElement('audio');
bearGrowl2.src = 'assets/sounds/bear_02.ogg';

const enemyImage = new Image();
enemyImage.src = 'assets/polar_bear/walk_left/bear_walk_left.png';

class Enemy {
  constructor() {
    this.x = canvas.width + 200;
    this.y = Math.random() * (canvas.height - 200) + 90;
    this.radius = 45;
    this.speed = 1.5;
    this.frame = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.spriteWidth = 120;
    this.spriteHeight = 120;
    this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
  }

  draw() {
    // ctx.fillStyle = "red";
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // ctx.fill();
    // ctx.stroke();
    ctx.drawImage(
      enemyImage,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x - 85,
      this.y - 84,
      this.spriteWidth + 60,
      this.spriteHeight + 80);
    }

  // sprite movement animations
  update() {
    this.x -= this.speed;
    if (this.x < 0 - this.radius * 2) {
      this.x = canvas.width + 200;
      this.y = Math.random() * (canvas.height - 150) + 90;
      this.speed = Math.random() * 2 + 2;
      
    }
    if (gameFrame % 5 == 0) {
      this.frame++;
      if (this.frame <= 2) this.frame = 0;
      if (this.frame == 0) {
        this.frameX = 0;
      } else {
        this.frameX++;
      }
      if (this.frame > 8) this.frame = 0;
      // else if (this.frame > 7) this.frameY = 0;
      // else if (this.frame < 1) this.frameY = 0;
      // else
       this.frameY = 0;
    }
    // collision detection with Santa
      const dx = this.x - santa.x;
      const dy = this.y - santa.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < this.radius + santa.radius) {
        if (enemy1.sound == 'sound1') {
         bearGrowl1.play();
        } else {
          bearGrowl2.play();
        }

        handleGameOver();
      }  
     }
  }


const enemy1 = new Enemy();
function handleEnemy() {
  enemy1.update();
  enemy1.draw();
}
function handleGameOver(){
  ctx.fillStyle = 'red';
  ctx.fillText('Game Over, Christmas is cancelled.' , 500, 400);
  gameOver = true;
  document.createElement('button')
}

function handleYouWin() {
  ctx.fillStyle = 'green';
  ctx.fillText('You saved Christmas', 540, 400);
  youWin = true;
}


// let reindeerImage = new Image();
// reindeerImage.src = "assets/Santa-sprites/Santa_and_Sleigh-1.png";
// class Reindeer {
//   constructor() {
//     this.alive = true;
//     this.width = 0;
//     this.height = 0;
//     this.x = canvas.width / 2 - this.width / 2;
//     this.y = 10;
//     this.Health = 100;
//   }
// }
// reindeer = new Reindeer();

// function handleReindeer() {

// }

// animations loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handlePenguins();
  santa.update();
  santa.draw();
  handleEnemy();
  ctx.fillStyle ='green';
  ctx.fillText('Dont let them escape! ', 600, 50);
  ctx.fillStyle = 'red';
  ctx.fillText('Health: ' + health, 1260, 50);
  ctx.fillStyle = 'black';
  ctx.fillText("score: " + score, 20, 50);
  gameFrame++;
  if (!gameOver && !youWin) requestAnimationFrame(animate);
}
if(score >= 10 && health > 0) {
  youWin();
}
animate();

window.addEventListener('resize', function () {
  canvas.getBoundingClientRect();
});
function playMusic() {
  if (gameAudio) {
    gameAudio = false;  
  
    audio3.play();
    audio3.volume = 1;
    audio3.loop = true;
  }
};