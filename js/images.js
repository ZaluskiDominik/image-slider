'use strict'

let images = {
    //number of images displayed by slider
    num : 5,
    //ranges from 1 to num
    currImgIndex : 1,

    //array of images that are displayed by slider
    images : [],

    //loads images from memory and add them to arry
    load : function(loadedCallback)
    {
        //counter of loaded images
        let loadedCounter = 0;

        for (let i = 1 ; i <= this.num ; i++)
        {
            //create new image
            let img = new Image();
            img.src = "img/" + i + ".jpg";
            //add it to array
            this.images.push( this.createImageWrapper(img) );

            img.onload = () => {
                this.imageLoaded(this.images[i - 1]);

                //count number of loaded images and when all are loaded call callback
                if (++loadedCounter == this.num)
                    loadedCallback();
            };
        }
    },

    //creates object wrapping Image object with added width, height and pos properties
    createImageWrapper : function(img)
    {
        return {
            img : img,

            //width, heigth of an image
            width : null,
            height : null,
            
            //coordinates of image's top left corner 
            pos : {
                x : null,
                y : null
            }
        };
    },

    //called when image has been loaded
    //sets centered position of an image on canvas, and assigns width, height of image
    imageLoaded : function(img)
    {
        //assign size to img wrapper based on image size
        img.width = img.img.width;
        img.height = img.img.height;

        //sets image position
        this.centerImgPosition(img);
    },

    //sets x and y coordinates so that image will be centered on canvas
    centerImgPosition : function(img)
    {
        img.pos.x = ( canvas.canvas.width - img.width ) / 2;
        img.pos.y = ( canvas.canvas.height - img.height ) / 2;
    },

    //returns current image object
    getCurrent : function()
    {
        return this.images[this.currImgIndex - 1];
    },

    //returns next image object from array
    getNext : function()
    {
        this.currImgIndex = this.currImgIndex % this.num + 1;

        return this.getCurrent();
    }
};