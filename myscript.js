var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var GridStartX = 10;
var GridStartY = 10;
var GridEndX = canvas.width - 10;
var GridEndY = canvas.height - 10;
var HorizontalDistanceBetween2Lines = -1;
var VerticalDistanceBetween2Lines = -1;
var balls = [];
var x = 10;
var y = 10;
var dx = -2;
var dy = +2;
var grid = [];


//Always call it after DrawGrid()
function initializeGrid(rows,columns)
{
	var x1 = 10;
	var y1 = 10;
	var xdis = HorizontalDistanceBetween2Lines;
	var ydis = VerticalDistanceBetween2Lines;
	for(r = 0; r < rows; ++r)
	{
		grid[r] = []
		for(c =0 ;c < columns; ++c)
		{
			grid[r][c]={x:x1+c*xdis,y:y1+r*ydis};
		}
	}
}
function DrawVerticalLines(num)
{
	var DistanceBetween2Lines = (canvas.width-20)/num;
	var StartX = GridStartX;
	var StartY = GridStartY;
	var EndX = GridStartX;
	var EndY = GridEndY;
	ctx.beginPath();
	for(count = 0; count <= num; ++count)
	{
		ctx.moveTo(StartX,StartY);
		ctx.lineTo(StartX,EndY);
		StartX = StartX + DistanceBetween2Lines;
	}
	ctx.strokeStyle = "#0066cc";
	ctx.stroke();
	ctx.closePath();
	return DistanceBetween2Lines;


}

function DrawHorizontalLines(num)
{
	var DistanceBetween2Lines = (canvas.height - 20)/num;
	var StartX = GridStartX;
	var StartY = GridStartY;
	var EndX = GridEndX;
	var Endy = GridStartY;

	ctx.beginPath();
	for(count = 0 ;count <= num ;++count)
	{
		ctx.moveTo(StartX,StartY);
		ctx.lineTo(EndX,StartY);
		StartY = StartY + DistanceBetween2Lines;

	}
	ctx.strokeStyle = "#0066cc";
	ctx.stroke();
	ctx.closePath();
	return DistanceBetween2Lines;
}
//It should be the first function to be called
function DrawGrid(rows,columns)
{
	HorizontalDistanceBetween2Lines = DrawVerticalLines(columns);
	VerticalDistanceBetween2Lines = DrawHorizontalLines(rows);
	return Math.min(HorizontalDistanceBetween2Lines,VerticalDistanceBetween2Lines);
}

function intializeBalls(rows,columns)
{
	
	for(r = 0;r < rows; ++r)
	{
		balls[r] = [];
		for(c = 0;c < columns; ++c)
		{
			balls[r][c] = {x:0,y:0,Status:0};
		}
	}
}
function DrawBall(x,y,ballRadius,color)
{
	if(balls[r][c].Status == 1)
	{
		ctx.beginPath();
		ctx.arc(x,y,ballRadius,0,Math.PI*2);
		ctx.fillStyle = color;
		ctx.fill();
		ctx.closePath();	
	}
	
}
function DrawBalls(rows,columns,ballRadius,x1,y1)
{
	xdis = HorizontalDistanceBetween2Lines;
	ydis = VerticalDistanceBetween2Lines;
	//console.log("Horizontal and vertical distance between circles "+ xdis+ " "+ydis);
	var x = x1 + xdis/2;
	var y = y1 + ydis/2;
	color = "#0095DD";
	

	for(r = 0;r < rows; ++r)
	{
		for(c =0 ;c < columns; ++c)
		{
			balls[r][c].x = x + c * xdis;
			balls[r][c].y = y + r * ydis;
			DrawBall(balls[r][c].x,balls[r][c].y,ballRadius,color);

		}
	}
	
	

}
function Draw()
{
	ctx.clearRect(0,0,canvas.width,canvas.height);
	MaxDiameter = DrawGrid(10,10);
	
	//console.log("MaxDiameter of circles can be "+MaxDiameter+" px");
	
	//x+=dx;
	//y+=dy;
	DrawBalls(10,10,MaxDiameter/6,x,y);
	//dx=-dx;
	//dy=-dy;
	//requestAnimationFrame(Draw);
}
intializeBalls(10,10);

//setInterval(Draw,50);
Draw();
initializeGrid(10,10);
canvas.addEventListener("click",mouseClickHandler,false);
function BoxDetect(x,y,rows,columns)
{
	xdis = HorizontalDistanceBetween2Lines;
	ydis = VerticalDistanceBetween2Lines;
	for(r = 0;r < rows; ++r)
	{
		for(c =0 ;c < columns; ++c)
		{
			x1=grid[r][c].x ;
			y1=grid[r][c].y ;
			if(x1<=x&&x<=x1+xdis&&y1<=y&&y<=y1+ydis)
			{
				//console.log("yo we found something");
				balls[r][c].Status = 1;
				break;
			}

		}
	}
}
function mouseClickHandler(e)
{
	var relativeX = e.clientX-canvas.offsetLeft;
	var relativeY = e.clientY-canvas.offsetTop;
	//console.log("xcord: "+relativeX+" ycord: "+relativeY);
	BoxDetect(relativeX,relativeY,10,10);
	Draw();
	//console.log("xcord balls: "+grid[1][0].x+" ycord: "+grid[1][0].y);
	//xdis = HorizontalDistanceBetween2Lines;
	//ydis = VerticalDistanceBetween2Lines;
	//console.log("xdis: "+ xdis+ "ydis: "+ ydis);

	//var mm = grid[1][0].x+xdis;
	//var pp = grid[1][0].y+ydis;
	//console.log("xcord balls end: "+mm+" ycord end: "+pp);
	//console.log("xcord balls: "+grid[0][1].x+" ycord: "+grid[0][1].y);
}