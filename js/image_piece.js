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

    //1 for counter clockwise, -1 for clockwise
    //make if 50% change for either one
    this.rotationDirection = ( Math.random() > 0.5 ) ? 1 : -1;
    
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

    //increases or decreases radius proportional to msDeltaTime
    this.makeNextStepRadius = function(msDeltaTime)
    {
        //change radius by fraction of 2 * maxRadius proportional to delta time and whole time of animation ratio
        //if time the animation was run is greater that half of the whole time of rotate animation
        //radius will be decreased, else increased
        this.radius += msDeltaTime / slider.msPiecesRotateAroundTime * 2 * this.maxRadius
            * Math.pow(-1, ( slider.msTimeCounter > slider.msPiecesRotateAroundTime / 2 ));
    }

    //increases or decreases angle(depends on this.rotationDirection) proportional to msDeltaTime
    this.makeNextStepAngle = function(msDeltaTime)
    {
        this.angle += msDeltaTime / slider.msPiecesRotateAroundTime
            * ImgPiece.numCirclesAround * 2 * Math.PI
            * this.rotationDirection;
    }

    //calculates current position of this img piece based on values of angle and radius
    this.calculatePos = function()
    {
        this.pos.x = 2.5 * this.radius * Math.cos(this.angle) + this.rotCenterPos.x;
        this.pos.y = this.radius * Math.sin(this.angle) + this.rotCenterPos.y;
    }

    //next step of rotating around center point animation
    this.rotateAdvance = function(msDeltaTime)
    {
        this.makeNextStepRadius(msDeltaTime);
        this.makeNextStepAngle(msDeltaTime);
        this.calculatePos();
    }

    //next step of disappearing animation
    this.disappearAdvance = function(msDeltaTime)
    {
        this.color.alpha -= msDeltaTime / slider.msPiecesDisappearTime;
    }
}

//number of circles around center point that will be done while transisting between images
ImgPiece.numCirclesAround = 1.5;
//length of the square which visually represents img piece
ImgPiece.size = 8;