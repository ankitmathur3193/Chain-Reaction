var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var GridStartX = 10;
var GridStartY = 10;
var GridEndX = canvas.width - 10;
var GridEndY = canvas.height - 10;
var HorizontalDistanceBetween2Lines = -1;
var VerticalDistanceBetween2Lines = 1;
var balls = [];
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
			balls[r][c] = {x:0,y:0,Status:1};
		}
	}
}
function DrawBalls(rows,columns,ballRadius,x1,y1)
{
	xdis = HorizontalDistanceBetween2Lines;
	ydis = VerticalDistanceBetween2Lines;
	console.log("Horizontal and vertical distance between circles "+ xdis+ " "+ydis);
	x = x1 + xdis/2;
	y = y1 + ydis/2;

	

	for(r = 0;r < rows; ++r)
	{
		for(c =0 ;c < columns; ++c)
		{
			balls[r][c].x = x + c * xdis;
			balls[r][c].y = y + r * ydis;
			if(balls[r][c].Status == 1)
			{
				ctx.beginPath();
				ctx.arc(balls[r][c].x,balls[r][c].y,ballRadius,0,Math.PI*2);
				ctx.fillStyle = "#0095DD";
				ctx.fill();
				ctx.closePath();
			}

		}
	}
	
	

}
function Draw()
{
	MaxDiameter = DrawGrid(10,10);
	console.log("MaxDiameter of circles can be "+MaxDiameter+" px");
	DrawBalls(10,10,MaxDiameter/6,10,10);
}
intializeBalls(10,10);
Draw();