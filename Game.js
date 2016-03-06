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
  var backdrop = null;
  var dude = null;
  var baddy = null;
  var platform = null;
  var floor = null;
  var platform1 = null;
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
  var debugging;

  $('#debug').on('click', function() {
    $('#debugCanvas').toggle();
    console.log('debug button clicked');
    debugging = (debugging) ? false : true;
    setCookie('debug', debugging, 30);
  });

  // ------------------------------------------------------------ event handlers

  function onInit() {
    console.log('>> initializing');

    if ((getCookie('debug') === '') || (getCookie('debug') === 'false')) {
      debugging = false;
      console.log('cookie not found');
    } else if (getCookie('debug') === 'true') {
      debugging = true;
      console.log('cookie found and the value is: ' + debugging);
    }

    setCookie('debug', debugging, 30);
    //debugging = (getCookie('debug')) ? true : false;
    if (debugging === true) {
      console.log('debugger enabled' + debugging);
      $('#debugCanvas').toggle();
    }
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
    var sSheet = 'gameAssets';
    // setup sprite to act as a floor skin
    platform = assetManager.getSprite(sSheet);

    b2d.setup(platform, 'floor');

    backdrop = assetManager.getSprite(sSheet);
    backdrop.x = 0;
    backdrop.y = 0;
    backdrop.scaleY = 1;
    backdrop.scaleX = 1.2;
    backdrop.gotoAndPlay('sky');
    stage.addChild(backdrop);

    // add snake to the stage
    dude = assetManager.getSprite(sSheet);
    dude.x = 200;
    dude.y = 200;
    //console.log(dude);

    // h = 23
    dude.gotoAndPlay('dudeIdile');
    stage.addChild(dude);
    b2d.spriteMake(dude, 14, 23, 'player');

    /*
    var shape = new createjs.Shape();
    var SIZE = 2;
    var centerX = 200;
    var centerY = 548.775;
    shape.graphics.beginFill('red').drawRect(centerX - SIZE / 2, centerY - SIZE / 2, SIZE, SIZE);
    stage.addChild(shape);
    */

    baddy = assetManager.getSprite('gameAssets');
    baddy.x = 300;
    baddy.y = 300;
    baddy.gotoAndPlay('moveLeft');
    stage.addChild(baddy);
    b2d.spriteMake(baddy, 14, 15, 'baddy');

    floor = assetManager.getSprite('gameAssets');
    floor.x = 0;
    floor.y = 570;
    floor.scaleX = 2.3;
    floor.gotoAndPlay('platform');
    stage.addChildAt(floor, 1);

    platform1 = assetManager.getSprite(sSheet);
    platform1.x = 0;
    platform1.y = 488;
    platform1.scaleX = 1.191;
    platform1.scaleY = 0.8;
    platform1.gotoAndPlay('platform');
    stage.addChild(platform1);
    //b2d.addDebug();

    txt = new createjs.Text('', '12px Arial', '#111');
    txt.lineWidth = 550;
    txt.lineHeight = 15;
    txt.textBaseline = 'top';
    txt.textAlign = 'left';
    txt.y = 15;
    txt.x = 15;

    createjs.Ticker.setFPS(24);
    createjs.Ticker.useRAF = true;
    createjs.Ticker.addEventListener('tick', onTick);
  }

  var txt = null;
  function onTick(e) {
    // TESTING FPS
    //document.getElementById('fps').innerHTML = createjs.Ticker.getMeasuredFPS();

    // put your other stuff here!
    // ...
    //console.log(debugging);
    if (debugging) {
      stage.addChild(txt);
      txt.visible = true;
      var data = b2d.playerData();
      txt.text = 'fps: ' +  createjs.Ticker.getMeasuredFPS();
      txt.text += '\nX: ' + data.pos.x;
      txt.text += '\nY: ' + data.pos.y;
      //txt.text += '\nangle: ' + data.angle;
      txt.text += '\nvelocity X: ' + data.vel.x;
      txt.text += '\nvelocity Y: ' + data.vel.y;
      txt.text += '\non floor: ' + data.touchingFloor;
      txt.text += '\ncan jump: ' + data.touchingDown;
      txt.text += '\nside hit: ' + data.sideHit;
      //txt.text += '\nangular velocity: ' + data.angularVel;
    } else {
      stage.removeChild(txt);
      txt.visible = false;
    }
    // update the stage!
    move();
    b2d.update();
    stage.update();
  }

})();

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + '; ' + expires;
}

function getCookie(cname) {
  var name = cname + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}
