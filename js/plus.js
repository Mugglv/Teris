var W=400;
var H=600;
var ROWS=H/20;
var COLS=W/20;

var map=[];
function drawMap() {
    for (let y = 0; y < ROWS; y++) {
        map[y]=[];
        for (let x = 0; x < COLS; x++) {
            map[y][x]=0;
        }
    }
}

var shapes=[
    [1,1,1,1],
    [1,1,1,0,
     1],
    [1,1,1,0,
     0,0,1],
    [1,1,0,0,
     1,1],
    [0,1,1,0,
     1,1],
    [1,1,0,0,
     0,1,1],
    [0,1,0,0,
     1,1,1]
];

var currShape=[];
function drawShape() {
    var index_shape=Math.floor(Math.random()*shapes.length);
    var shape=shapes[index_shape];
    var index_color=Math.floor(Math.random()*colors.length);
    for (let y = 0; y < 4; y++) {
        currShape[y]=[];
        for (let x = 0; x < 4; x++) {
            let i=y*4+x;
            if (shape[i]) {
                currShape[y][x]=1+index_color;
            }else{
                currShape[y][x]=0;
            }
        }
    }
}

var colors = [
    '#00c2ff', '#12afaf', '#15cc8f', '#ed405d', '#aaa9a9', '#f4d311', '#ef940f'
];

var status=true;
var currX=COLS/2-1,currY=0;
function settled() {
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            if (currShape[y][x]) {
                map[y+currY][x+currX]=currShape[y][x];
            }
        }
    }

    status=false;
}

function isValid(offsetX,offsetY,newShape) {
    offsetY=offsetY||0;
    newShape=newShape||currShape;

    offsetX+=currX;
    offsetY+=currY;

    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            if (newShape[y][x]) {
                if (typeof map[y+offsetY][x+offsetX]=='undefined'
                ||offsetX<0
                ||offsetX>=COLS
                ||offsetY>=ROWS) {
                    return false;
                }
            }
        }
    }
    return true;
}

var count=0;
var temp=[];
function countBlock(x,y) {
    // for (let i = -1; i <= 1; i++) {
        if(map[y][x]==map[y-1][x]){
            count++;
            temp[count]=[x,y-1];
            countBlock(x,y-1);
        }
        if(map[y][x]==map[y+1][x]){
            count++;
            temp[count]=[x,y+1];
            countBlock(x,y+1);
        }
        if(map[y][x]==map[y][x-1]){
            count++;
            temp[count]=[x-1,y];
            countBlock(x-1,y);
        }
        if(map[y][x]==map[y][x+1]){
            count++;
            temp[count]=[x+1,y];
            countBlock(x+1,y)
        }

        return count;
    // }
}