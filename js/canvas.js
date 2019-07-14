'use strict'

let canvas = {
    //handles for the canvas and its 2d context
    canvas : document.getElementById("canvas"),
    ctx : null,
    
    //set fixed size of the canvas and get 2d graphics context
    init : function()
    {
        this.ctx = this.canvas.getContext("2d");

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
};