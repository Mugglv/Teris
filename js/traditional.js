var W = 400;
var H = 600;
var BLOCK = 20;
var COLS = W / BLOCK;
var ROWS = H / BLOCK;

var currShape;  //moving shape
var currX = COLS / 2, currY = 0;    //position of moving shape
var status;     //if current shape needs to stop moving
var gameOver;
var score=0;
var scoreInfo=document.getElementById('score');

// var colors = [  //purple      //blue      //red
//     '#fcd8ca', '#a52482', '#61bce8', '#8f1911', '#bba17e', '#ffd373', '#c6d7e8'
// ];
var colors = [
    '#c2ffad', '#c2ffad', '#c2ffad', '#c2ffad', '#c2ffad', '#c2ffad', '#c2ffad'
];
// var colors = [
//     '#f44336', '#e91e63', '#9c27b0', '#9c27b0', '#9c27b0', '#9c27b0', '#9c27b0'
// ];
// var colors = [
//     '#00c2ff', '#12afaf', '#15cc8f', '#ed405d', '#aaa9a9', '#f4d311', '#ef940f'
// ];


var map = [];
function createMap() {

    for (let y = 0; y < ROWS; y++) {
        map[y] = [];
        for (let x = 0; x < COLS; x++) {
            map[y][x] = 0;
        }
    }
    // console.log('map',map);
}

var shapes = [
    [1, 1, 1, 1],
    [1, 1, 1, 0,
     1],
    [1, 1, 1, 0,
     0, 0, 1],
    [1, 1, 0, 0,
     1, 1],
    [1, 1, 0, 0,
     0, 1, 1],
    [0, 1, 1, 0,
     1, 1],
    [0, 1, 0, 0,
     1, 1, 1]
];
function randomShape() {
    var index = Math.floor(Math.random() * shapes.length);
    var shape = shapes[index];
    // console.log(shape);
    currShape = [];
    for (let y = 0; y < 4; y++) {
        currShape[y] = [];
        for (let x = 0; x < 4; x++) {
            var i = 4 * y + x;
            if (shape[i]) {
                currShape[y][x] = 1 + index;
            } else {
                currShape[y][x] = 0;
            }
        }

    }
    // console.log('currshape',currShape);
    currX = COLS / 2-2;
    currY = 0;
    status = true;
    score++;
    scoreInfo.innerHTML=score;
    fastSpeed();
}

function rotate() {
    let newShape = [];
    for (let y = 0; y < 4; y++) {
        newShape[y] = [];
        for (let x = 0; x < 4; x++) {
            newShape[y][x] = currShape[3 - x][y];
        }
    }
    // console.log('rotate', newShape);
    return newShape;
}

function settled() {
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            // console.log(currShape[y][x]);
            if (currShape[y][x]) {
                map[y + currY][x + currX] = currShape[y][x];
            }
        }
    }
    status = false;
}

//move down & check line & settle down & create new shape
function move() {
    if (isValid(0, 1)) {
        currY++;
    } else {
        settled();
        clearLine();
        if (gameOver) {
            clearAllIntervals();
            // console.log('GG');
            drawPic('img/failed.png');
            return;
        }
        randomShape();
    }
}

document.onkeydown = function (e) {
    switch (e.keyCode) {
        case 37:    //'left
            if (isValid(-1)) {
                currX--;
            }
            break;
        case 39:    //right
            if (isValid(1)) {
                currX++;
            }
            break;
        case 40:    //down
            if (isValid(0, 1)) {
                currY++;
            }
            break;
        case 38:    //up --> rotate
            var rotated = rotate();
            if (isValid(0, 0, rotated)) {
                currShape = rotated;
            }
            break;
        case 32:    //space  --> drop the shape
            while (isValid(0, 1)) {
                currY++;
            }
            move();
            break;
    }

}

function isValid(offsetX, offsetY, newShape) {
    // offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    newShape = newShape || currShape;

    offsetX += currX;
    offsetY += currY;

    // console.log(status);

    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            if (newShape[y][x]) {
                if (typeof map[y + offsetY] == 'undefined'
                    || typeof map[y + offsetY][x + offsetX] == 'undefined'
                    || map[y + offsetY][x + offsetX]) {

                    if (offsetY == 1 && status) {
                        gameOver = true;
                        playBtn.className='btn';
                        // console.log(gameOver);
                    }
                    return false;
                }
            }
        }
    }
    return true;
}

function clearLine() {
    for (let y = ROWS - 1; y >= 0; y--) {
        var isFullLine = true;
        for (let x = 0; x < COLS; x++) {
            if (map[y][x] == 0) {
                isFullLine = false;
                break;
            }
        }

        if (isFullLine) {
            document.getElementById( 'audio' ).play();
            for (let j = y; j > 0; j--) {
                for (let i = 0; i < COLS; i++) {
                    map[j][i] = map[j - 1][i];
                }
            }
            y++;
            score+=10;
            scoreInfo.innerHTML=score;
        }
    }
    fastSpeed();
}

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

function drawBlock(x, y) {
    ctx.fillRect(BLOCK * x, BLOCK * y, BLOCK - 1, BLOCK - 1);
    ctx.strokeRect(BLOCK * x, BLOCK * y, BLOCK - 1, BLOCK - 1);
}

function repaint() {
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = 'black';
    // ctx.strokeStyle = 'rgba(0, 0, 0, 0.57)';

    for (let x = 0; x < COLS; x++) {
        for (let y = 0; y < ROWS; y++) {
            if (map[y][x]) {
                ctx.fillStyle = colors[map[y][x] - 1];
                drawBlock(x, y);
            }
            ctx.fillStyle="#c2ffad";
            ctx.font = "16px bold Atari";
            ctx.fillText(".",x*BLOCK-2,y*BLOCK+2);
        }
    }
    // drawPic('img/bg.png');

    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            if (currShape[y][x]) {
                ctx.fillStyle = colors[currShape[y][x] - 1];
                drawBlock(currX + x, currY + y);
            }
        }
    }
    // console.log('repaint');
}

var paintTimer;
var moveTimer;
var playBtn=document.getElementById('play');

function start() {
    score=0;
    clearAllIntervals();
    createMap();
    randomShape();
    gameOver = false;
    timer();
    playBtn.className='disabled';
}

function play() {
    if(playBtn.className=='disabled'){
        return;
    }else{
        start();
    }
    playBtn.className='disabled';
}

var flag=true;
function pause() {
    if (flag) {
        clearAllIntervals();
    }else{
        timer();
    }
    flag=!flag;
}

function timer() {
    paintTimer = setInterval(function () {
        repaint();
    }, 30);
    
    
    moveTimer = setInterval(function () {
        move();
    }, 400);
}

function clearAllIntervals() {
    clearInterval(paintTimer);
    clearInterval(moveTimer);
}

window.onload=function () {
    drawPic('img/cover.png');
}

function drawPic(url) {
    var img=new Image();
    img.src=url;
    img.onload=function () {
        ctx.drawImage(img,0,0);
    }
}

function fastSpeed() {
    if (score>=100) {
        clearInterval(moveTimer);
        moveTimer = setInterval(function () {
            move();
        }, 200);
    }
}