//get handle of the canvas and its 2d context
let canvas=document.getElementById("canvas");
let ctx=canvas.getContext("2d");

//amout of time for displaying each image[ms]
const timeForImage=2000;

//number of frames while image changing animation lasts
const framesNum=50;

//true while image is changing
let inMotion=false;
let frameCounter=0;

//set fixed size of the canvas
function initCanvas()
{
	canvas.width=window.innerWidth;
	canvas.height=window.innerHeight;
}

//object representation of one pixel of an image
function ImgPiece(r, g, b, x, y)
{
	this.color={ red : r, green : g, blue : b };
	this.x=x;
	this.y=y;

	this.initRadius=function()
	{
	    this.maxRadius=Math.random() * 40 + 30;
	    this.radius=0;
	    this.stepRadius=this.maxRadius * 2 / framesNum;
	}

	this.initAngle=function()
	{
	    this.stepAngle=Math.PI / framesNum;
	    this.stepAngle=(Math.random() > 0.5) ? this.stepAngle * -1 : this.stepAngle;
	    this.angle=Math.random() * Math.PI;
	}

	this.initAngle();
	this.initRadius();
	
	this.getRgb=function()
	{
		return "rgb(" + this.color.red + "," + this.color.green + "," + this.color.blue + ")"; 		
	}

	//draw pixel on the screen
	this.draw=function()
	{
		ctx.fillStyle=this.getRgb();
		ctx.fillRect(this.x, this.y, pieceSize, pieceSize);
	}

	this.changeRadius=function()
	{
		this.radius+=this.stepRadius;
		if (this.radius >= this.maxRadius && this.stepRadius>0)
			this.stepRadius*=-1;
	}

	this.move=function()
	{
		this.angle+=this.stepAngle;
		this.x=2 * this.radius * Math.cos(this.angle) + x;
		this.y=this.radius * Math.sin(this.angle) + y;
	}

	this.step=function()
	{
		this.changeRadius();
		this.move();
	}
}

//resolution of an image
let imgWidth, imgHeight;
let pieces;
const pieceSize=8;
let topX, topY;

//load img element witch will serve as pixels source
let currImg=1, imgNum=5;
let img=new Image();
img.src="img/1.jpg";

//create an array of ImgPieces objects
function createImagePieces()
{
	//put source image on the canvas
	imgWidth=img.width;
	imgHeight=img.height;
	topX = (canvas.width - imgWidth) / 2;
	topY = (canvas.height - imgHeight) / 2;
	ctx.drawImage(img, topX, topY, imgWidth, imgHeight);
	
	//access this image's pixels
	data=ctx.getImageData(topX, topY, imgWidth, imgHeight).data;
	pieces=[];

	for (let i=0 ; i<imgHeight; i+=pieceSize)
	{
	    for (let j=0 ; j<imgWidth ; j+=pieceSize)
	    {
	        let x=j + topX;
	        let y=i + topY;
	        let index=i * imgWidth * 4 + (j * 4);
	        pieces.push( new ImgPiece(data[index], data[index+1], data[index+2], x, y) );
	    }
	}
}

//begin animation
function startAnimation()
{
	createImagePieces();
	setTimeout(function(){ inMotion=true; }, timeForImage);
	animationLoop();
}

//when img element loads call startAnimation function
img.addEventListener("load", startAnimation);

function drawImage()
{
    for (let i=0 ; i<pieces.length; i++)
        pieces[i].draw();
}

function movePixels()
{
    for (let i=0 ; i<pieces.length ; i++)
        pieces[i].step();
}

function changeImage()
{
	currImg=currImg + 1 % numImg;
	img.src=currImg + ".jpg";
}

function animationLoop()
{
	if (inMotion)
	{
		//clear screen
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		movePixels();
		drawImage();
		if (++frameCounter > framesNum*3.2)
		{
		    max = 0, ind=0;
		    for (let i = 0 ; i < pieces.length ; i++)
		        if (Math.abs(pieces[i].radius) > max) {
		            max = pieces[i].radius;
		            ind = i;
		        }
		    console.log(pieces[ind].radius, "  ", pieces[ind].maxRadius, "  ", pieces[ind].stepRadius, "\t\t", framesNum);
		    frameCounter=0;
		    inMotion=false;
		    ctx.clearRect(0, 0, canvas.width, canvas.height);
		    ctx.drawImage(img, topX, topY, imgWidth, imgHeight);
		    setTimeout(function () { inMotion = true; }, timeForImage);
		    for (let i=0 ; i<pieces.length ; i++)
		    {
		        pieces[i].initAngle();
		        pieces[i].initRadius();
		    }
		}
	}
	window.requestAnimationFrame(animationLoop);
}


//startup functions
initCanvas();