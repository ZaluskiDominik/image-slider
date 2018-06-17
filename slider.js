//get handle of the canvas and its 2d context
let canvas=document.getElementById("canvas");
let ctx=canvas.getContext("2d");

//amout of time for displaying each image[ms]
const timeForImage=2000;

//number of frames while image changing animation lasts
const numFrames=180;
let frameCounter=null;

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

	//initialize radius, calculate increase of the radius with each animation step
	this.initRadius=function()
	{
	    this.maxRadius=Math.random() * 50 + 50;
	    this.radius=0;
	    this.stepRadius=this.maxRadius * 2 / numFrames;
	}

	//initialize angle, calculate increase of the angle with each animation step
	this.initAngle=function()
	{
	    this.stepAngle=3*Math.PI / numFrames;
	    this.stepAngle=(Math.random() > 0.5) ? this.stepAngle * -1 : this.stepAngle;
	    this.angle=Math.random() * Math.PI;
	}

	this.initAngle();
	this.initRadius();
	
	//returns color in rgb format
	this.getRgb=function()
	{
		return "rgb(" + this.color.red + "," + this.color.green + "," + this.color.blue + ")"; 		
	}

	//draw piece on the screen
	this.draw=function()
	{
		ctx.fillStyle=this.getRgb();
		ctx.fillRect(this.x, this.y, pieceSize, pieceSize);
	}

	//grow or shrink radius
	this.changeRadius=function()
	{
		this.radius+=this.stepRadius;
		if (this.radius >= this.maxRadius && this.stepRadius>0)
			this.stepRadius*=-1;
	}

	//change angle of elipsoide motion
	this.move=function()
	{
		this.angle+=this.stepAngle;
		this.x=2.5 * this.radius * Math.cos(this.angle) + x;
		this.y=this.radius * Math.sin(this.angle) + y;
	}

	//next step of the animation
	this.step=function()
	{
		this.changeRadius();
		this.move();
	}
}

//handle for img element
let img;
//resolution of an image
let imgWidth, imgHeight;
//array of image pieces
let pieces;
//size of one square block which is built from pieceSize^2 number of pixels.
const pieceSize=8;
//left top corner coordinates of an image
let topX, topY;

//number of currently displayed image
let currImg=1, numImg=5;

//load img element witch will serve as pixels source
img=new Image();
img.src="img/1.jpg";

function initImageSize()
{
	imgWidth=img.width;
	imgHeight=img.height;
	topX = (canvas.width - imgWidth) / 2;
	topY = (canvas.height - imgHeight) / 2;	
}

function drawImage()
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(img, topX, topY, imgWidth, imgHeight);	
}

function changeImage()
{
	currImg=currImg % numImg + 1;
	img.src="img/" + currImg + ".jpg";
}

//when img element loads call startAnimation function
img.addEventListener("load", startNextImageAnimation);

function createImagePieces()
{
	//access an image's pixels
	//[reg, green, blue, opacity]
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

//create an array of ImgPieces objects
function createImage()
{
	initImageSize();
	drawImage();
	createImagePieces();
}

//called after image has been changed
function startNextImageAnimation()
{
	createImage();
	setTimeout(function(){ frameCounter=0; }, timeForImage);
}

function drawPieces()
{
    for (let i=0 ; i<pieces.length; i++)
        pieces[i].draw();
}

function movePieces()
{
    for (let i=0 ; i<pieces.length ; i++)
        pieces[i].step();
}

function animationLoop()
{
	//if animation has started
	if (frameCounter!=null)
	{
		//clear screen and draw next frame
		ctx.fillStyle="rgba(211, 211, 211, 0.2)";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		movePieces();
		drawPieces();

		if (++frameCounter > numFrames)
		{
			//stop animation and load next image
		    frameCounter=null;
		    changeImage();
		}
	}
	window.requestAnimationFrame(animationLoop);
}


//startup functions
initCanvas();
animationLoop();