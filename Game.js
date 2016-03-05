/*jshint browser:true */
/*jshint devel:true */
/*global createjs */
/*global AssetManager */
/*global manifest */

// AssetManager Demo
// Sean Morrow
// May 12, 2014

// game variables
var stage = null;
var canvas = null;
var debugCanvas = null;
var context = null;
var debugContext = null;

(function() {
  'use strict';

  window.addEventListener('load', onInit);

  // frame rate of game
  var frameRate = 24;

  // game objects
  var assetManager = null;
  var dude = null;
  var baddy = null;
  var platform = null;
  var star = null;
  var setup = null;
  var b2d = null;

  // keyboard key map
  var KEYCODE_LEFT = 37;
  var KEYCODE_RIGHT = 39;
  var KEYCODE_UP = 38;
  var KEYCODE_DOWN = 40;

  // current inputs
  var leftArrow = false;
  var rightArrow = false;
  var upArrow = false;
  var downArrow = false;

  // ------------------------------------------------------------ show the debugger
  $('#debug').on('click', function() {
    $('#debugCanvas').toggle();
  });

  // ------------------------------------------------------------ event handlers

  function onInit() {
    console.log('>> initializing');

    setupCanvas();

    b2d = new B2d();
    // construct preloader object to load spritesheet and sound assets
    assetManager = new AssetManager(stage);
    stage.addEventListener('onAllAssetsLoaded', onReady);

    // load the assets
    assetManager.loadAssets(manifest);

    //keyboard handlers
    window.onkeyup = keyUpHandler;
    window.onkeydown = keyDownHandler;
  }

  function setupCanvas() {
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

  }

  function keyDownHandler(e) {
    switch (e.keyCode) {
    case KEYCODE_LEFT:
      console.log('left');
      if (!leftArrow) {
        dude.gotoAndPlay('dudeMoveLeft');
      }
      leftArrow = true;
      break;
    case KEYCODE_RIGHT:
      console.log('right');
      if (!rightArrow) {
        dude.gotoAndPlay('dudeMoveRight');
      }
      rightArrow = true;

      break;
    case KEYCODE_UP:
      console.log('up');
      upArrow = true;
      break;
    case KEYCODE_DOWN:
      console.log('down');
      downArrow = true;
      break;
    }
  }

  function keyUpHandler(e) {
    switch (e.keyCode) {
    case KEYCODE_LEFT:
      leftArrow = false;
      break;
    case KEYCODE_RIGHT:
      rightArrow = false;
      break;
    case KEYCODE_UP:
      upArrow = false;
      break;
    case KEYCODE_DOWN:
      downArrow = false;
      break;
    }
  }

  function move() {
    if ((!leftArrow) && (!rightArrow)) {
      dude.gotoAndPlay('dudeIdile');
    }

    if (leftArrow) {
      b2d.movePlayer('left');
    }

    if (rightArrow) {
      b2d.movePlayer('right');
    }

    if (upArrow) {
      b2d.movePlayer('up');
      upArrow = false;
    }

    if (downArrow) {
      b2d.movePlayer('down');
    }
  }

  function onReady(e) {
    console.log('>> setup');
    // kill event listener
    stage.removeEventListener('onAllAssetsLoaded', onReady);

    platform = assetManager.getSprite('gameAssets');
    platform.x = 0;
    platform.y = 570;
    platform.scaleX = 2.3;
    console.log(platform.getBounds());
    platform.gotoAndPlay('platform');
    stage.addChildAt(platform, 1);

    b2d.setup(platform, 'floor');
    b2d.addDebug();
    // add snake to the stage
    dude = assetManager.getSprite('gameAssets');
    dude.x = 200;
    dude.y = 200;
    console.log(dude);
    dude.gotoAndPlay('dudeIdile');
    stage.addChild(dude);
    b2d.spriteMake(dude, 14, 23, 'player');
    //b2d.createPlayer(dude);

    baddy = assetManager.getSprite('gameAssets');
    baddy.x = 300;
    baddy.y = 300;
    baddy.gotoAndPlay('moveLeft');
    stage.addChildAt(baddy, 0);
    b2d.spriteMake(baddy, 14, 15, 'baddy');
    //b2d.createBaddy(baddy);

    createjs.Ticker.setFPS(24);
    createjs.Ticker.useRAF = true;
    createjs.Ticker.addEventListener('tick', onTick);
  }

  function onTick(e) {
    // TESTING FPS
    document.getElementById('fps').innerHTML = createjs.Ticker.getMeasuredFPS();

    // put your other stuff here!
    // ...

    // update the stage!
    move();
    b2d.update();
    stage.update();
  }

})();
