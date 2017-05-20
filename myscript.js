var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var GridStartX = 10;
var GridStartY = 10;
var GridEndX = canvas.width - 10;
var GridEndY = canvas.height - 10;
var HorizontalDistanceBetween2Lines = -1;
var VerticalDistanceBetween2Lines = -1;
var balls = [];
var x = 10//center x coordinate for first circle
var y = 10//center y coordinate for second circle
var dx = 0;
var dy = 0;
var grid = [];
var colors = ['#800000','#228B22'];
var players = [];
var total_players = 2;//By Deafult number of players
var currentPlayer = 0;//by default current player is first
var to_animate = [];
var lock = false;
var animateFlag = false;
var Rows = 10;
var Columns = 10;
var to_translate = [];
var iter_translate = 0;
var dx1=4;
var dy1=4;

/*

In x,y corrdinate space
row = y axis
column = x axis
*/

function Player(id,color)
{
	this.id = id;
	this.color = color;
	this.printPlayerInfo = function(){
		console.log("Player id: "+this.id+" and color is: "+this.color);
	}
}
function initializePlayers(num=2)
{
	total_players = num;

	for(count = 0;count<num;++count)
	{
		players[count] = new Player(count,colors[count]);
	}
	//currentPlayer = players[0];
}
//Always call it after DrawGrid()
function initializeGrid(rows,columns)//grid[r][c] = top left cordinates for r,c box
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
	ctx.strokeStyle = players[currentPlayer].color ;
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
	ctx.strokeStyle = players[currentPlayer].color;
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

function intializeBalls(rows,columns)//Status  = 0 means box is empty
{
	
	for(r = 0;r < rows; ++r)
	{
		balls[r] = [];
		for(c = 0;c < columns; ++c)
		{
			balls[r][c] = {x:0,y:0,Status:0,player_id:0};
		}
	}
}
function DrawBall(x,y,ballRadius,color)
{
	
		ctx.beginPath();
		ctx.arc(x,y,ballRadius,0,Math.PI*2);
		ctx.fillStyle = color;
		ctx.fill();
		ctx.closePath();	
	
	
}
//x1,y1 corresponds to left start grid
//only call it after mouse click detected
function DrawBalls(rows,columns,ballRadius,x1,y1)
{

	var x = x1+HorizontalDistanceBetween2Lines/2;
	var y = y1+VerticalDistanceBetween2Lines/2;
	color = "#0095DD";
	

	for(r = 0;r < rows; ++r)
	{
		for(c =0 ;c < columns; ++c)
		{
			balls[r][c].x = x + c * HorizontalDistanceBetween2Lines;
			balls[r][c].y = y + r * VerticalDistanceBetween2Lines;
			if(balls[r][c].Status == 1)
			{
				//console.log("Ball Drawn at ",r," ",c);
				DrawBall(balls[r][c].x,balls[r][c].y,ballRadius,players[balls[r][c].player_id].color);
			}
			else if(balls[r][c].Status == 2)
			{
				//console.log("Ball Drawn at ",r," ",c);
				DrawBall(balls[r][c].x,balls[r][c].y,ballRadius,players[balls[r][c].player_id].color);
				DrawBall(balls[r][c].x-10,balls[r][c].y,ballRadius,players[balls[r][c].player_id].color);
			}
			else if(balls[r][c].Status == 3)
			{
				//console.log("Ball Drawn at ",r," ",c);
				DrawBall(balls[r][c].x,balls[r][c].y,ballRadius,players[balls[r][c].player_id].color);
				DrawBall(balls[r][c].x-10,balls[r][c].y,ballRadius,players[balls[r][c].player_id].color);
				DrawBall(balls[r][c].x,balls[r][c].y-10,ballRadius,players[balls[r][c].player_id].color);
			}
		}
	}
	
	

}
function CheckStatus(rows,columns)
{
	var flag = false;
	for(r = 0;r < rows; ++r)
	{
		for(c = 0;c < columns; ++c)
		{
			if(balls[r][c].Status == 4)
			{
				to_animate.push({x:r,y:c,id:balls[r][c].player_id});//inserting box number
				balls[r][c].Status = 0;
				balls[r][c].player_id = 0;
				flag = true;
				//console.log("Status == 4 found at ",r," ",c);
			}
		}
	}
	return flag;
}
//func(column,row)->It checks if given row,column is within grid or not.
function func(column,row)
{
	if(column>=0&&column<Columns&&row>=0&&row<Rows)
		return true;
	else
		return false;
}
function bfs()
{
	for(i = 0;i < to_animate.length; ++i)
	{
		var x1 = to_animate[i].x;
		var y1 = to_animate[i].y;
		var id = to_animate[i].id;
		if(func(x1+1,y1))
		{
			//console.log("Increasing Row y",x1," ",y1);
			to_translate.push({x:x1,y:y1,a:0,b:1,id:id});
		}
		if(func(x1-1,y1))
		{
			//console.log("Decreasing  Row y",x1," ",y1);
			to_translate.push({x:x1,y:y1,a:0,b:-1,id:id});
		}
		if(func(x1,y1+1))
		{
			//console.log("Increasing Columns x",x1," ",y1);
			to_translate.push({x:x1,y:y1,a:1,b:0,id:id});
		}
		if(func(x1,y1-1))
		{
			//console.log("Decreasing  Columns x",x1," ",y1);
			to_translate.push({x:x1,y:y1,a:-1,b:0,id:id});
		}
		
	}
}
function DrawBallTraversal(ballRadius)
{
	for(i = 0;i < to_translate.length ;++i)
	{
		var x1 = to_translate[i].x;
		var y1 = to_translate[i].y;
		var id = to_translate[i].id;
		var a = to_translate[i].a;
		var b = to_translate[i].b;
		var r = balls[x1][y1].x;
		var c = balls[x1][y1].y;
		r = r + a*dx1;
		c = c + b*dy1;
		DrawBall(r,c,ballRadius,colors[id]);
		
	}
}
function updateStatus(x,y,id)
{
	//console.log("Status updated for ",x," ",y);
	balls[x][y].Status+=1;
	balls[x][y].player_id=id;
}
function updateNeighbour()
{
	for(i = 0;i < to_animate.length; ++i)
	{
		var x1 = to_animate[i].x;
		var y1 = to_animate[i].y;
		var id = to_animate[i].id;
		if(func(x1+1,y1))
		{
			//console.log("Going for Status update for ",x1+1," ",y);
			updateStatus(x1+1,y1,id);
		}
		if(func(x1-1,y1))
		{
			updateStatus(x1-1,y1,id);
		}
		if(func(x1,y1+1))
		{
			updateStatus(x1,y1+1,id);
		}
		if(func(x1,y1-1))
		{
			updateStatus(x1,y1-1,id);
		}
		
	}
}
function Draw()
{
	ctx.clearRect(0,0,canvas.width,canvas.height);
	MaxDiameter = DrawGrid(Rows,Columns);

	var ballRadius = MaxDiameter/6;
	
	//console.log("MaxDiameter of circles can be "+MaxDiameter+" px");
	
	//x+=dx;
	//y+=dy;
	var xdis = HorizontalDistanceBetween2Lines/2;
	var ydis = VerticalDistanceBetween2Lines/2;
	if(animateFlag||CheckStatus(Rows,Columns))
	{
		if(!animateFlag)
		{
			//console.log("goind to do bfs");
			bfs();
			iter_translate = 0;
			dx1 = 2;
			dy1 = 2;
			animateFlag = true;
		}
		else if(iter_translate<10)
		{
			//console.log("Doing ball traversal animation");
			DrawBallTraversal(ballRadius);
			dx1+=2;
			dy1+=2;
			iter_translate++;
		}
		else
		{
			//console.log("Updating Neighbour Status");
			updateNeighbour();
			to_animate = [];
			to_translate = [];
			animateFlag = false;
			iter_translate = 0;
		}
	}

	DrawBalls(Rows,Columns,ballRadius,x,y);
	
	/*if(x+ballRadius+xdis>HorizontalDistanceBetween2Lines||x+xdis<ballRadius||y+ballRadius+ydis>VerticalDistanceBetween2Lines||y+ydis<ballRadius)
	{
		dx=-dx;
		dy=-dy;
	}*/
	
	//dx=-dx;
	//dy=-dy;
	requestAnimationFrame(Draw);
}





function init()
{
	initializePlayers(2);
	intializeBalls(Rows,Columns);
	Draw();
	initializeGrid(Rows,Columns);
	
}
init();
//setInterval(Draw,40);
canvas.addEventListener("click",mouseClickHandler,false);

function BoxDetect(x,y,rows,columns)
{
	xdis = HorizontalDistanceBetween2Lines;
	ydis = VerticalDistanceBetween2Lines;
	var flag = 0;
	for(r = 0;r < rows; ++r)
	{
		for(c =0 ;c < columns; ++c)
		{
			x1=grid[r][c].x ;
			y1=grid[r][c].y ;
			if(x1<=x&&x<=x1+xdis&&y1<=y&&y<=y1+ydis)
			{
				//console.log("Touch found at ",r," ",c);
				if(balls[r][c].Status == 0)
				{
					balls[r][c].Status = 1;
					balls[r][c].player_id = currentPlayer;
					currentPlayer = (currentPlayer+1)%2;
					flag = 1;
					break;
				}
				else if(currentPlayer == balls[r][c].player_id)
				{
					balls[r][c].Status++;
					currentPlayer = (currentPlayer+1)%2;
					flag = 1;
					break;
				}
				
				
			}
			if(flag)
			{

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
	BoxDetect(relativeX,relativeY,Rows,Columns);
	//Draw();
	//console.log("xcord balls: "+grid[1][0].x+" ycord: "+grid[1][0].y);
	//xdis = HorizontalDistanceBetween2Lines;
	//ydis = VerticalDistanceBetween2Lines;
	//console.log("xdis: "+ xdis+ "ydis: "+ ydis);

	//var mm = grid[1][0].x+xdis;
	//var pp = grid[1][0].y+ydis;
	//console.log("xcord balls end: "+mm+" ycord end: "+pp);
	//console.log("xcord balls: "+grid[0][1].x+" ycord: "+grid[0][1].y);
}

