'use strict'

let slider = {
	//wrapper object for currently displayed image
	currImg : null,
    //time during which solid image is displayed and no animations are applied
    //after that time transition between images occurs
	msDisplayImgTime : 3000,
    //time during which image pieces rotates
    msPiecesRotateAroundTime : 3000,
    //time it takes for image pieces do disappear
    msPiecesDisappearTime : 600,
    //counts miliseconds during rotate around and disappear animations 
    msTimeCounter : 0,
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

            //set timestamp in miliseconds of previous frame
            this.animationLoop.prevFrameTime = performance.now();
    		//start animation loop
    		this.animationLoop();
    	});
    },

    //handles next frames of animation
    animationLoop : function()
    {
        //recursive callback when next frame is ready
        window.requestAnimationFrame(this.animationLoop.bind(this));

        //elapsed time between previous and current frame
        let msTimeBetweenFrames = this.getMsTimeBetweenFrames();
        this.updatePrevFrameTime();

    	//if transition between images not started do nothing
    	if ( !this.startTransition )
    		return;

        //increase elapsed time of animation by elapsed time between next frames
        this.msTimeCounter += msTimeBetweenFrames;

        //let dispatchAnimations function handle which animation should be run
        this.dispatchAnimations(msTimeBetweenFrames);
    },

    //assigns timestamp of current frame to previous frame
    updatePrevFrameTime : function()
    {
        this.animationLoop.prevFrameTime = this.animationLoop.currFrameTime;
    },

    //returns difference between timestamps of current frame and previous frames occurences
    getMsTimeBetweenFrames : function()
    {
        //get timestamp in miliseconds for current frame
        this.animationLoop.currFrameTime = performance.now();

        return this.animationLoop.currFrameTime - this.animationLoop.prevFrameTime;
    },

    //applies rotate or disappear animation depending on time which elapsed from start
    //of transition between images
    dispatchAnimations : function(msTimeBetweenFrames)
    {
        //during first msPiecesRotateAroundTime miliseconds apply rotate animation to image pieces
        if (this.msTimeCounter <= this.msPiecesRotateAroundTime)
        {
            this.rotateImgPiecesAnimation(msTimeBetweenFrames);
            this.dispatchAnimations.disappearStarted = false;
        }
        //after that during next msPiecesDisappearTime miliseconds apply disappear animation
        else if (this.msTimeCounter < this.msPiecesRotateAroundTime + this.msPiecesDisappearTime)
        {
            //after rotation has been played reset all img pieces to their initial positions
            imgPieces.resetPos();

            //while pieces are disappearing start displaying under them next image
            if (this.dispatchAnimations.disappearStarted === false)
            {
                this.nextImage();
                this.dispatchAnimations.disappearStarted = true;
            }

            this.disappearImgPiecesAnimation(msTimeBetweenFrames);
        }
        else
            this.startDisplayingSolidImage();
    },

    //rotates image pieces around center points, each piece has its own center point
    rotateImgPiecesAnimation : function(msTimeBetweenFrames)
    {
	   	//draw semi transparent background so it gives effect of a blur
	   	this.drawSemiTransparentBackground();
	   	
        //move image pieces and draw them
	   	imgPieces.move(msTimeBetweenFrames);
	    imgPieces.draw();
    },

    disappearImgPiecesAnimation : function(msTimeBetweenFrames)
    {
		this.drawSolidBackground();
		this.drawCurrImg();

		imgPieces.disappear(msTimeBetweenFrames);
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

    //stops animations, reset msTimeCounter and displays next image for msDisplayImgTime
    //period of time
    startDisplayingSolidImage : function()
    {
    	this.startTransition = false;
    	this.msTimeCounter = 0;

    	//draw solid image
    	this.drawCurrImg();
    	imgPieces.create(this.currImg);

    	setTimeout( () => {
    		this.startTransition = true;
    	}, this.msDisplayImgTime);
    }
};

slider.init();