'use strict'

let imgPieces = {
    //array of created image pieces from solid image
    pieces : [],

    //creates image pieces from supplied wrapper for image object
    //image will be divided on squares each of ImgPiece.size length
    create : function(img)
    {
        this.pieces = [];

        //access an image's pixels
        //[red, green, blue, opacity]
        let data = canvas.ctx.getImageData(img.pos.x, img.pos.y,
            img.width, img.height).data;

        for (let i = 0 ; i < img.height ; i += ImgPiece.size)
        {
            for (let j = 0 ; j < img.width ; j += ImgPiece.size)
            {
                //position of image piece
                let x = j + img.pos.x;
                let y = i + img.pos.y;

                let pieceColor = this.getAvgColorFromSquareOfPixels(img, x, y, data);
                this.pieces.push( new ImgPiece(pieceColor.r, pieceColor.g, 
                    pieceColor.b, x, y) );
            }
        }
    },

    //returns average color from given square of pixels
    getAvgColorFromSquareOfPixels : function(img, topLeftX, topLeftY, imgData)
    {
        //index under which red property of color for pixel of position(topLeftX, topLeftY)
        //can be accessed in data array
        let index = ( topLeftY * img.width * 4 ) + ( topLeftX * 4 );
  
        //number of pixels that were sumed up
        let pixelCount = 0;
        let sumRGB = { r : 0, g : 0, b : 0 };

        for (let i = topLeftY ; i < topLeftY + ImgPiece.size && i < img.height ; i++)
        {
            for (let j = topLeftX ; j < topLeftX + ImgPiece.size && j < img.width ; j++)
            {
                //for each pixel sum all components of colors
                sumRGB.r += imgData[index];
                sumRGB.g += imgData[index + 1];
                sumRGB.b += imgData[index + 2];

                index += 4;
                //increase pixel count of sumed pixels
                pixelCount++;
            }
        }

        return {
            r : sumRGB.r / pixelCount,
            g : sumRGB.g / pixelCount,
            b : sumRGB.b / pixelCount
        };
    },

    //draws all image pieces
    draw : function()
    {
        this.pieces.forEach( (piece) => {
            piece.draw();
        });
    },

    //makes next step in rotate animation with all image pieces
    move : function(msDeltaTime)
    {
        this.pieces.forEach( (piece) => {
            piece.rotateAdvance(msDeltaTime);
        });
    },

    //makes next step in disappear animation with all image pieces
    disappear : function(msDeltaTime)
    {
        this.pieces.forEach( (piece) => {
            piece.disappearAdvance(msDeltaTime);
        });
    },

    //sets all img pieces to their initial positions
    resetPos : function()
    {
        this.pieces.forEach( (piece) => {
            piece.radius = 0;
            piece.calculatePos();
        });
    }
};