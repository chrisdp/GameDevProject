var Setup = function() {

  this.setupCanvas = function() {
     // get reference to canvas
     canvas = document.getElementById('stage');
     debugCanvas = document.getElementById('debugCanvas');

     // set canvas to as wide/high as the browser window
     canvas.width = 900;
     canvas.height = 600;

     // create stage object
     stage = new createjs.Stage(canvas);

     context = canvas.getContext('2d');
     debugContext = debugCanvas.getContext('2d');
     stage.snapPixelsEnabled = true;

   };
};
