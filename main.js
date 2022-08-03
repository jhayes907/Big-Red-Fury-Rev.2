// canvas setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 1500;
canvas.height = 800;
// const movement = document.getElementById('movement');

let santa;
let score = 0;
let gameFrame = 0;
ctx.font = '40px Georgia';
let gameSpeed = .5;
let gameOver = false;

window.addEventListener('DOMContentLoaded', function(){
})
// mouse interaction
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click: false
}


canvas.addEventListener('mousedown', function(event){
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
});

canvas.addEventListener('mouseup', function(event){
    mouse.click = false;
})

// document.addEventListener('keydown', movementHandler);
// function movementHandler(e) {
//     console.log("movement", e.key);
//     switch(e.key) {
//         case "ArrowUp":
//             //move santa up
//             santa.y - santa.speed >= 0 ? (santa.y -= santa.speed) : null;
//             break;                                                    
//         case "ArrowLeft":                                                        
//             //move santa left                                                         
//             santa.x - santa.speed >= 0 ? (santa.x -= santa.speed) : null;                                                       
//             break;                                                        
//         case "ArrowDown":                                                        
//             //move santa down                                                        
//             santa.y + santa.speed <= canvas.height ? (santa.y += santa.speed) : null;                                                        
//             break;                                                        
//         case "ArrowRight":                                                           
//             //move santa right                                                   
//             santa.x + santa.speed <= canvas.width ? (santa.x += santa.speed) : null;                                                        
//             break; 
//         // case "q":
//         //         santa                                                               
//         case "w":                                                        
//             //move santa up                                                        
//             santa.y - santa.speed >= 0 ? (santa.y -= santa.speed) : null;                                                       
//             break;                                                        
//         case "a":                                                        
//             //move santa left                                                       
//             santa.x - santa.speed >= 0 ? (santa.x -= santa.speed) : null;                                                        
//             break;                                                        
//         case "s":                                                            
//             //move santa down                                                    
//             santa.y + santa.speed <= canvas.height ? (santa.y += santa.speed) : null;                                                        
//             break;                                                        
//         case "d":                                                            
//             //move santa right                                                    
//             santa.x + santa.speed <= canvas.width ? (santa.x += santa.speed) : null;                                                       
//             break;                                                        
//         }
// }
   

canvas.addEventListener('mousedown', function(event){
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
});

canvas.addEventListener('mouseup', function(event){
    mouse.click = false;
})

// add sprite image paths
// const santaLeft = new Image();
// santaLeft.src = 'images/sprite-left.png';

// Player
class Santa {
    constructor(){
        this.x = canvas.width/2;
        this.y = canvas.height/2;
        this.radius = 50;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
    //     this.spriteWidth = 934;
    //     this.spriteHeight = 641;
    }
    // move Santa to pointer  direction function
    update(){
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        // let theta = Math.atan2(dx, dy);
        // this.angle = theta;
        if (mouse.x != this.x) {
            this.x -= dx/50;
        }
        if (mouse.y != this.y) {
            this.y -= dy/50;
        }    
    }
    draw(){// Directional lineTo
        if (mouse.click) {
            ctx.lineWidth = 0.1;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
            // 
        }
        
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
        ctx.fillRect(this.x, this.y, this.radius, 10);

        // added so sprite will face pointer
        // ctx.save();
        // ctx.translate(this.x, this.y);
        // ctx.rotate(this.angle);
        // if (this.x >= mouse.x){
        //     ctx.drawImage(playerLeft, this.framex * this.spriteWidth, this.framey * this.spriteHeight, this.spriteHeight, this.spriteWidth, this.x, this.y, this.spriteWidth/4, this.spriteHeight/4);
        // } else {
        //     ctx.drawImage(playerLeft, this.framex * this.spriteWidth, this.framey * this.spriteHeight, this.spriteHeight, this.spriteWidth,//play with this for sprite positioning relative to collision radius// this.x, this.y, this.spriteWidth/4, this.spriteHeight/4);
        // }
        // ctx.restore();
    }
}
santa = new Santa();

// add penguin sprite paths
// Baddies
const penguinsArray = [];
// const penguinImage = new Image();
// set penguinImage source
// penguinImage.src = 'penguinImage';

class Penguin {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100 + Math.random() * canvas.height;
        // modify these properties for size and speed
        this.radius = 50;
        this.speed = Math.random() * 5 + 1;
        this.distance;
        this.counted = false;
        // // change to collision kill sound
        // this.sound = math.random() <= 0.5 ? 'sound1' : 'sound2';
    }
    update() {
        this.y -= this.speed;
        const dx = this.x - santa.x;
        const dy = this.y - santa.y;
        this.distance = Math.sqrt(dx*dx + dy*dy);
       
    }
    draw() {
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
        // ctx.drawImage(penguinImage, this.x, this.y, this.radius, this.radius);
    }
}

// setup path to penguin kill audio effects
// const penguinEnd1 = document.createElement('audio');
// penguinEnd1.src = '';
// const penguinEnd2 = document.createElement('audio');
// penguinEnd2.src = '';

// penguin rendering
function handlePenguins(){
    if (gameFrame % 50 == 0){
        penguinsArray.push(new Penguin());     
    }
    for (let i = 0; i < penguinsArray.length; i++){
        penguinsArray[i].update();
        penguinsArray[i].draw();
        if (penguinsArray[i].y < 0 - penguinsArray[i].radius * 2) {
            penguinsArray.splice(i, 1);
            i--;
        } else if (penguinsArray[i].distance < penguinsArray[i].radius + santa.radius) { 
                if (!penguinsArray[i].counted){
                    // if (penguinsArray[i].sound == 'sound1'){
                    // penguinEnd1.play();
                    // } else {
                    // penguinEnd2.play();
                    // }
                    score++;
                    penguinsArray[i].counted = true;
                    // change to dead penguin flash
                    penguinsArray.splice (i, 1);
                    i--;
            }
        }       
    }
    for (let i = 0; i < penguinsArray.length; i++) {

    }
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

// function handleBackround() {
    // BG.x1 -= gameSpeed;
    // if (BG.x1 < -BG.width) BG.x1 = BG.width;
    // BG.x2 -= gameSpeed;
    // if (BG.x2 < -BG.width) BG.x2 = BG.width;
//     ctx.drawImage(background, BG.x1, BG.y, BG.width, BG.height);
//     ctx.drawImage(background, BG.x2, BG.y, BG.width, BG.height);
// }



// Ememies
// const enemyImage = new Image();
// enemyImage.src = '';
class Enemy {
    constructor(){
        this.x = canvas.width + 200;
        this.y = Math.random() * (canvas.height - 150) + 90;
        this.radius = 60;
        this.speed = Math.random() * 2 + 2;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
        // this.spriteWidth = ;
        // this.spriteHeight = ;
    }   
    draw(){
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        // ctx.drawImage(enemyImage, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, 
        // this.spriteWidth, this.spriteHeight, this.x, this.y, this.spriteWidth / 4, this.spriteHeight / 
        // 4);
    }
    update(){
        this.x -=this.speed;
        if (this.x < 0 - this.radius * 2){
            this.x = canvas.width + 200;
            this.y = Math.random() * (canvas.height - 150) + 90;
            this.speed = math.random() * 2 + 2;  
        }
    if (gameFrame % 5 == 0){
        this.frame++;
        if (this.frame >= 12) this.frame = 0;
        if (this.frame == 3 || this.frame == 7 || this.frame == 11){
            this.frameX = 0;
        } else {
            this.frameX++;
        }
        if (this.frame < 3) this.frameY = 0;
        else if (this.frame < 7) this.frameY = 1;
        else if (this.frame < 11) this.frameY = 2;
        else this.frameY = 0;
    }
    // collision detection with Santa
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    const distance = Math.sqrt(dx*dx + dy*dy);
    if (distance < this.radius + player.radius){
        handleGameOver();
    }
  }
}
const enemy1 = new Enemy();
function handleEnemies(){
        enemy1.draw();
        enemy1.update();
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
    // handleBackround();
    handlePenguins()
    santa.update();
    santa.draw();
    // handleEnemies();
    ctx.fillStyle = 'black';
    ctx.fillText('score: ' + score, 10, 50);
    gameFrame++;
    if (!gameOver) requestAnimationFrame(animate);
    
}
animate();

window.addEventListener('resize', function() {
    canvas.getBoundingClientRect();
});