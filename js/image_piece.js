'use strict'

function ImgPiece(red, green, blue, xPos, yPos)
{
    this.color = { red : red, green : green, blue : blue, alpha : 1.0 };
    //current position of img piece
    this.pos = { x : xPos, y : yPos };
    //point around which img piece rotates
    this.rotCenterPos = { x : xPos, y : yPos };

    //max radius of rotation around center point
    this.maxRadius = Math.random() * 50 + 50;
    //current radius
    this.radius = 0;

    //current angle of rotation around center pos
    this.angle = Math.random() * Math.PI;

    //calculates increase factors for angle and radius with each frame
    this.init = function()
    {
        this.initStepRadius();
        this.initStepAngle()
    }

    //calculate increase of the radius with each animation step
    this.initStepRadius = function()
    {
        this.stepRadius = this.maxRadius * 2 / slider.numFramesRotateAround;
    }

    //calculate increase factor for angle every new frame
    this.initStepAngle = function()
    {
        //increase factor for angle every new frame
        this.stepAngle = ImgPiece.numCirclesAround * Math.PI * 2
            / slider.numFramesRotateAround;
        //make if 50% change for negative value
        if (Math.random() > 0.5)
            this.stepAngle *= -1;
    }
    
    //returns color in rgba string
    this.getRgba = function()
    {
        return "rgba(" + this.color.red + "," + this.color.green + "," + 
            this.color.blue + "," + this.color.alpha + ")";      
    }

    //draw img piece on the screen
    this.draw = function()
    {
        canvas.ctx.fillStyle = this.getRgba();
        canvas.ctx.fillRect(this.pos.x, this.pos.y, ImgPiece.size, ImgPiece.size);
    }

    //when stepRadius > 0 increases radius by stepRadius
    //when stepRadius < 0 shrinks radius
    this.makeNextStepRadius = function()
    {
        //change radius by stepRaius factor
        this.radius += this.stepRadius;

        //if radius reached maxRadius change increse factor to negative value
        //so that now radius will be shrinking
        if (this.radius >= this.maxRadius)
            this.stepRadius *= -1;
    
        //if animation is at end return to radius = 0
        if (slider.frameCounter == slider.numFramesRotateAround)
            this.radius = 0;
    }

    this.makeNextStepAngle = function()
    {
        this.angle += this.stepAngle;
    }

    //calculates current position of this img piece based on values of angle and radius
    this.calculatePos = function()
    {
        this.pos.x = 2.5 * this.radius * Math.cos(this.angle) + this.rotCenterPos.x;
        this.pos.y = this.radius * Math.sin(this.angle) + this.rotCenterPos.y;
    }

    //next step of rotating around center point animation
    this.rotateAdvance = function()
    {
        this.makeNextStepRadius();
        this.makeNextStepAngle();
        this.calculatePos();
    }

    //next step of disappearing animation
    this.disappearAdvance = function()
    {
        this.color.alpha -= 1.0 / slider.numFramesDisappear;
    }

    this.init();
}

//number of circles around center point that will be done while transisting between images
ImgPiece.numCirclesAround = 1.5;
//length of the square which visually represents img piece
ImgPiece.size = 8;