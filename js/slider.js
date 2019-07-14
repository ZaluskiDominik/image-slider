'use strict'

let slider = {
	//wrapper object for currently displayed image
	currImg : null,
    //time during which solid image is displayed and no animations are applied
    //after that time transition between images occurs
	msDisplayImgTime : 2000,
    numFramesRotateAround : 200,
    numFramesDisappear : 40,
    //true when rotate animation and after then disappear animation happens
    startTransition : false,

    //init canvas and wait for all images to load
    init : function()
    {
    	canvas.init();
    	this.drawSolidBackground();

    	//when all images has been loaded
    	images.load(() => {
    		//sets first image to display
    		this.currImg = images.getCurrent();
            //display first image
    		this.startDisplayingSolidImage();

    		//start animation loop
    		this.animationLoop();
    	});
    },

    //handles next frames of animation
    animationLoop : function()
    {
    	//recursive callback when next frame is ready
		window.requestAnimationFrame(this.animationLoop.bind(this));

    	//if transition between images not started do nothing
    	if ( !this.startTransition )
    		return;

        //during first numFramesRotateAround number of frames apply rotate animation to image pieces
    	if (++this.frameCounter <= this.numFramesRotateAround)
        {
    		this.rotateImgPiecesAnimation();
        }
        //after that during numFramesDisappear number of frames apply disappear animation
		else if (this.frameCounter < this.numFramesRotateAround + this.numFramesDisappear)
		{
            //while pieces starts disappearing start displaying under them next image
			if (this.frameCounter == this.numFramesRotateAround + 1)
				this.nextImage();

			this.disappearImgPiecesAnimation();
		}
		else
			this.startDisplayingSolidImage();
    },

    //rotates image pieces around center points, each piece has its own center point
    rotateImgPiecesAnimation : function()
    {
        //if it's last frame of rotating img pieces then draw solid background
        //in order to remove blur
        if (this.frameCounter == this.numFramesRotateAround)
            this.drawSolidBackground();
        else
	   	//draw semi transparent background so it gives effect of a blur
	   	   this.drawSemiTransparentBackground();
	   	
        //move image pieces and draw them
	   	imgPieces.move();
	    imgPieces.draw();
    },

    disappearImgPiecesAnimation : function()
    {
		this.drawSolidBackground();
		this.drawCurrImg();

		imgPieces.disappear();
	    imgPieces.draw();
    },

    //draws background without opacity
    drawSolidBackground : function()
    {
		canvas.ctx.fillStyle = "rgb(50, 50, 50)";
		canvas.ctx.fillRect(0, 0, canvas.canvas.width, canvas.canvas.height);
    },

    //draws backgroud with opacity(it mades blur effect when image pieces moves)
    drawSemiTransparentBackground : function()
    {
		canvas.ctx.fillStyle = "rgba(50, 50, 50, 0.2)";
		canvas.ctx.fillRect(0, 0, canvas.canvas.width, canvas.canvas.height);
    },

    drawCurrImg : function()
    {
		canvas.ctx.drawImage(this.currImg.img, this.currImg.pos.x, this.currImg.pos.y,
			this.currImg.width, this.currImg.height);
    },

    nextImage : function()
    {
    	this.currImg = images.getNext();
    },

    //stops animations, reset frame counter and displays next image for msDisplayImgTime
    //period of time
    startDisplayingSolidImage : function()
    {
    	this.startTransition = false;
    	this.frameCounter = 0;

    	//draw solid image
    	this.drawCurrImg();
    	imgPieces.create(this.currImg);

    	setTimeout( () => {
    		this.startTransition = true;
    	}, this.msDisplayImgTime);
    }
};

slider.init();