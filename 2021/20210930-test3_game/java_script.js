let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 70;
let brickHeight = 20;
let brickPadding = 20;
let brickOffsetTop = 30;
let brickOffsetLeft = 25;
let bricks = [];
for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status:1 };
    }
}
//設定磚塊參數

let paddleHeight = 10;
let paddleWidth = 100;
let paddlex = (canvas.width-paddleWidth)/2;
//設定拍子位置參數
let rightPressed = false;
let leftPressed = false;
//設定造成拍子左右移動按鍵初始判斷

let ballRadius = 10; 
//定義球半徑;
let x = canvas.width/2;
let y = canvas.height-paddleHeight-ballRadius;
//定義球的位置
let dx = 2;
let dy = -2;
//每次調整位置的數值

let ColorR = 0;
let ColorG = 149;
let ColorB = 221;
//設定球的顏色


document.addEventListener('keydown',keyDownHandler,false);
document.addEventListener('keyup',keyUpHandler,false);
//監聽按鍵是否有被按下跟放開


setInterval(draw,10);
//draw每十毫秒都會被執行一次;

function drawBricks(){
	for(c=0; c<brickColumnCount; c++) {
		for(r=0; r<brickRowCount; r++){
			if (bricks[c][r].status == 1){
			// 檢查磚塊狀態是1
				let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
				let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX,brickY,brickWidth,brickHeight);
				ctx.fillStyle = "red";
				ctx.fill();
				ctx.closePath();
			}
		
		}
	}
}
//畫出磚塊

function drawPaddle(){
	ctx.beginPath();
	ctx.rect(paddlex,canvas.height-paddleHeight,paddleWidth,paddleHeight);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}
//畫出拍子

function drawBall(){
	ctx.beginPath();
	ctx.arc(x,y,ballRadius,0,Math.PI*2);
	ctx.fillStyle = 'rgb('+ColorR+','+ColorG+','+ColorB+')';
	ctx.fill();
	ctx.closePath();
}
//畫出一顆球

function keyDownHandler(e){
	if(e.keyCode == 39){
		rightPressed = true;
	}
	else if (e.keyCode == 37){
		leftPressed = true;
	}
}
//對於左右按鍵按下產生的判斷

function keyUpHandler(e){
	if(e.keyCode == 39){
		rightPressed = false;
	}
	else if (e.keyCode == 37){
		leftPressed = false;
	}
}
//對於左右按鍵放開產生的判斷

function brickCollisionData(){
	for(c=0; c<brickColumnCount; c++){
		for(r=0; r<brickRowCount; r++){
			let b = bricks[c][r];
			let downDistance = (y+ballRadius-b.y)^2;
			let topDistance = (b.y+brickHeight-(y-ballRadius))^2;
			let leftDistance = (x+ballRadius-b.x)^2;
			let rightDistance = (b.x+brickWidth-(x-ballRadius))^2;
			if(b.status == 1 ){
				if(y+ballRadius > b.y && y-ballRadius < b.y+brickHeight && x+ballRadius > b.x && x-ballRadius < b.x+brickWidth){
					b.status = 0;
					if( downDistance<leftDistance && downDistance<rightDistance){
						dy = -dy;
					}
					else if (leftDistance<topDistance && leftDistance<downDistance){
						dx = -dx;
					}
					else if (topDistance<leftDistance && topDistance<rightDistance){
						dy = -dy;
					}
					else if (rightDistance<topDistance && rightDistance<downDistance){
						dx = -dx;
					}
				
				} 
			}
		}
	}
}
//判斷球是否有撞到磚塊

function paddleCollisionData(){
	let topDistance = (y+dy-(canvas.height-ballRadius-paddleHeight))^2;
	let leftDistance = (x+ballRadius- paddlex)^2;
	let rightDistance = (paddlex+paddleWidth-(x-ballRadius))^2;
	if(y + dy >= canvas.height - ballRadius - paddleHeight && x > paddlex && x < paddlex+paddleWidth ){
		if( topDistance < leftDistance && topDistance < rightDistance){
			dy = -dy;
		}
		else{
			dx = -dx;
		}
	}
}
//判斷球是否有撞到板子


function draw(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	//清除畫布
	drawBricks();//帶入磚塊
	drawBall();//帶入球
	drawPaddle();//帶入拍子
	brickCollisionData();//磚塊碰撞公式
	paddleCollisionData();//板子碰撞公式
		
	if( y + dy < ballRadius){
		dy = -dy;
		ColorR =Math.random()*255;
		ColorG =Math.random()*255;
		ColorB =Math.random()*255;
	}
	else if ( y + dy > canvas.height - ballRadius ){
		if ( x > paddlex && x < paddlex + paddleWidth){
			dy = -dy;
		}
		else {
			dy = -dy;
			/*
			alert("Game Over");
			document.location.reload();
			*/
		}
	}
	if(x + dx > canvas.width-ballRadius || x + dx < ballRadius){
		dx = -dx;
		ColorR =Math.random()*255;
		ColorG =Math.random()*255;
		ColorB =Math.random()*255;
	};
	//讓球反彈(除了底部) + 隨機變色

	x += dx;
	y += dy;
	//每次執行完更新球的位置
	
	if(rightPressed && paddlex < canvas.width-paddleWidth){
		paddlex += 7;
	}
	else if(leftPressed && paddlex > 0){
		paddlex -= 7;
	}
	//左右按鍵按下時,拍對應移動
}


