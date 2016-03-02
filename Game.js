/*jshint browser:true */
/*jshint devel:true */
/*global createjs */
/*global AssetManager */
/*global manifest */

// AssetManager Demo
// Sean Morrow
// May 12, 2014

(function() {
  'use strict';

  window.addEventListener('load', onInit);

  // game variables
  var stage = null;
  var canvas = null;

  // frame rate of game
  var frameRate = 24;

  // game objects
  var assetManager = null;
  var dude = null;
  var baddy = null;
  var star = null;

  // ------------------------------------------------------------ event handlers
  function onInit() {
    console.log('>> initializing');

    // get reference to canvas
    canvas = document.getElementById('stage');
    // set canvas to as wide/high as the browser window
    canvas.width = 900;
    canvas.height = 600;
    // create stage object
    stage = new createjs.Stage(canvas);

    // construct preloader object to load spritesheet and sound assets
    assetManager = new AssetManager(stage);
    stage.addEventListener('onAllAssetsLoaded', onReady);

    // load the assets
    assetManager.loadAssets(manifest);
  }

  function onReady(e) {
    console.log('>> setup');
    // kill event listener
    stage.removeEventListener('onAllAssetsLoaded', onReady);

    // add snake to the stage
    dude = assetManager.getSprite('gameAssets');
    dude.x = 200;
    dude.y = 200;
    dude.gotoAndPlay('dudeMoveRight');
    stage.addChild(dude);

    baddy = assetManager.getSprite('gameAssets');
    baddy.x = 300;
    baddy.y = 300;
    baddy.gotoAndPlay('moveLeft');
    stage.addChildAt(baddy, 0);
    /*
    biplane = assetManager.getSprite('biplaneAssets');
    biplane.x = 300;
    biplane.y = 300;
    biplane.gotoAndPlay('flyRight');
    stage.addChild(biplane);

    createjs.Sound.play('boing');
    */

    // startup the ticker
    createjs.Ticker.setFPS(frameRate);
    createjs.Ticker.addEventListener('tick', onTick);
  }

  function onTick(e) {
    // TESTING FPS
    document.getElementById('fps').innerHTML = createjs.Ticker.getMeasuredFPS();

    // put your other stuff here!
    // ...

    // update the stage!
    stage.update();
  }

})();
