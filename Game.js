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

// controller vars
var gamepadConnected = false;
var controllers = {};
var buttonNames = ['A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT', 'Back', 'Start', 'LAB', 'RAB', 'D U', 'D D', 'D L', 'D R', 'Menu'];

(function() {
  'use strict';

  window.addEventListener('load', onInit);

  window.addEventListener('gamepadconnected', function(e) {
    console.log('Gamepad connected at index %d: %s. %d buttons, %d axes.',
                e.gamepad.index, e.gamepad.id,
                e.gamepad.buttons.length, e.gamepad.axes.length);
    gamepadConnected = true;
    addgamepad(e.gamepad);
  });

  window.addEventListener('gamepaddisconnected', function(e) {
    console.log('Gamepad disconnected from index %d: %s',
                e.gamepad.index, e.gamepad.id);
    gamepadConnected = false;
    removegamepad(e.gamepad);
  });

  function addgamepad(gamepad) {
    controllers[gamepad.index] = gamepad; var d = document.createElement('div');
    d.setAttribute('id', 'controller' + gamepad.index);
    var t = document.createElement('h4');
    t.appendChild(document.createTextNode('gamepad: ' + gamepad.id));
    d.appendChild(t);
    var b = document.createElement('div');
    b.className = 'controller-buttons';
    for (var i = 0; i < gamepad.buttons.length; i++) {
      var e = document.createElement('span');
      e.className = 'controller-button';
      e.innerHTML = buttonNames[i];
      b.appendChild(e);
    }
    d.appendChild(b);
    var a = document.createElement('div');
    a.className = 'axes';
    for (i = 0; i < gamepad.axes.length; i++) {
      e = document.createElement('progress');
      e.className = 'axis';
      e.setAttribute('max', '2');
      e.setAttribute('value', '1');
      e.innerHTML = i;
      a.appendChild(e);
    }
    d.appendChild(a);
    document.getElementById('start').style.display = 'none';
    document.getElementById('controllerDebug').appendChild(d);
    console.log(controllers);
  }

  function updateStatus() {
    scangamepads();
    var j;
    for (j in controllers) {
      var controller = controllers[j];
      var d = document.getElementById('controller' + j);
      var buttons = d.getElementsByClassName('controller-button');
      for (var i = 0; i < controller.buttons.length; i++) {
        var b = buttons[i];
        var val = controller.buttons[i];
        var pressed = val == 1.0;
        if (typeof(val) == 'object') {
          pressed = val.pressed;
          val = val.value;
        }
        var pct = Math.round(val * 100) + '%';
        b.style.backgroundSize = pct + ' ' + pct;
        if (pressed) {
          b.className = 'controller-button pressed';
        } else {
          b.className = 'controller-button';
        }
      }

      var axes = d.getElementsByClassName('axis');
      for (var i = 0; i < controller.axes.length; i++) {
        var a = axes[i];
        a.innerHTML = i + ': ' + controller.axes[i].toFixed(4);
        a.setAttribute('value', controller.axes[i] + 1);
      }
    }
  }

  function removegamepad(gamepad) {
    var d = document.getElementById('controller' + gamepad.index);
    document.getElementById('controllerDebug').removeChild(d);
    delete controllers[gamepad.index];
  }

  function scangamepads() {
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
    for (var i = 0; i < gamepads.length; i++) {
      if (gamepads[i]) {
        if (!(gamepads[i].index in controllers)) {
          addgamepad(gamepads[i]);
        } else {
          controllers[gamepads[i].index] = gamepads[i];
        }
      }
    }
  }

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
      if (!leftArrow) {
        dude.gotoAndPlay('dudeMoveLeft');
      }
      leftArrow = true;
      break;
    case KEYCODE_RIGHT:
      if (!rightArrow) {
        dude.gotoAndPlay('dudeMoveRight');
      }
      rightArrow = true;

      break;
    case KEYCODE_UP:
      upArrow = true;
      break;
    case KEYCODE_DOWN:
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

    if (gamepadConnected) {
      var xAxe = controllers[0].axes[0].toFixed(4);
      var yAxe = controllers[0].axes[1].toFixed(4);
      if ((xAxe < 0.05) && (xAxe > -0.05)) {
        if (dude.currentAnimation !== 'dudeIdile') {
          dude.gotoAndPlay('dudeIdile');
        }
      }

      if (xAxe > 0.25) {
        if (dude.currentAnimation !== 'dudeMoveRight') {
          dude.gotoAndPlay('dudeMoveRight');
        }
        b2d.movePlayer('right', (xAxe * 4));
      }

      if (xAxe < -0.25) {
        if (dude.currentAnimation !== 'dudeMoveLeft') {
          dude.gotoAndPlay('dudeMoveLeft');
        }
        b2d.movePlayer('left', (xAxe * 4));
      }

      if (yAxe > 0.80) {
        b2d.movePlayer('down');
      }

      if (controllers[0].buttons[0].pressed) {
        b2d.movePlayer('up');
      }
    } else {

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
  }

  function onReady(e) {
    console.log('>> setup');
    // kill event listener
    stage.removeEventListener('onAllAssetsLoaded', onReady);

    if (navigator.getGamepads()[0] !== undefined) {
      gamepadConnected = true;
      addgamepad(navigator.getGamepads()[0]);
    }
    console.log(navigator.getGamepads());
    var sSheet = 'gameAssets';
    // setup sprite to act as a floor skin

    b2d.setup();

    var temp;
    var newFloor = [];
    for (var i = 0; i < worldData.levelOne.platforms.length; i++) {
      temp = worldData.levelOne.platforms[i];
      newFloor.push(assetManager.getSprite('gameAssets'));
      newFloor[i].x = temp.spawnX;
      newFloor[i].y = temp.spawnY;
      newFloor[i].scaleX = temp.width / 200;
      newFloor[i].scaleY = 0.8;
      newFloor[i].gotoAndPlay(temp.animation);
      stage.addChild(newFloor[i]);
      b2d.platformMake(newFloor[i], temp);
      //console.log(newFloor[i]);
    }

    backdrop = assetManager.getSprite(sSheet);
    backdrop.x = 0;
    backdrop.y = 0;
    backdrop.scaleY = 1;
    backdrop.scaleX = 1.2;
    backdrop.gotoAndPlay('sky');
    stage.addChildAt(backdrop, 0);

    // add snake to the stage
    dude = assetManager.getSprite(sSheet);
    dude.x = 200;
    dude.y = 200;
    //console.log(dude);

    // h = 23
    dude.gotoAndPlay('dudeIdile');
    stage.addChild(dude);
    b2d.spriteMake(dude, 14, 23, 'player');

    baddy = assetManager.getSprite('gameAssets');
    baddy.x = 300;
    baddy.y = 300;
    baddy.gotoAndPlay('moveLeft');
    stage.addChild(baddy);
    b2d.spriteMake(baddy, 14, 15, 'baddy');

    txtLeft = new createjs.Text('', '12px Arial', '#111');
    txtLeft.lineWidth = 550;
    txtLeft.lineHeight = 15;
    txtLeft.textBaseline = 'top';
    txtLeft.textAlign = 'left';
    txtLeft.y = 15;
    txtLeft.x = 15;

    txtRight = new createjs.Text('', '12px Arial', '#111');
    txtRight.lineWidth = 550;
    txtRight.lineHeight = 15;
    txtRight.textBaseline = 'top';
    txtRight.textAlign = 'right';
    txtRight.y = 15;
    txtRight.x = 885;

    createjs.Ticker.setFPS(24);
    createjs.Ticker.useRAF = true;
    createjs.Ticker.addEventListener('tick', onTick);
  }

  var txtLeft = null;
  var txtRight = null;
  function onTick(e) {
    // TESTING FPS
    //document.getElementById('fps').innerHTML = createjs.Ticker.getMeasuredFPS();
    updateStatus();
    // put your other stuff here!
    // ...
    //console.log(debugging);
    if (debugging) {
      stage.addChild(txtLeft);
      txtLeft.visible = true;
      var data = b2d.playerData();
      txtLeft.text = 'fps: ' +  createjs.Ticker.getMeasuredFPS();
      txtLeft.text += '\nX: ' + data.pos.x;
      txtLeft.text += '\nY: ' + data.pos.y;
      txtLeft.text += '\nvelocity X: ' + data.vel.x;
      txtLeft.text += '\nvelocity Y: ' + data.vel.y;
      txtLeft.text += '\non floor: ' + data.touchingFloor;
      txtLeft.text += '\ncan jump: ' + data.touchingDown;
      txtLeft.text += '\nside hit: ' + data.sideHit;

      // Right Text Debugger
      stage.addChild(txtRight);
      txtRight.visible = true;
      txtRight.text = ((gamepadConnected) ? 'connected' : 'disconnected') + ' :gamepad';

      // Controller Debugger
      if ($('#controllerDebug:visible').length === 0) {
        $('#controllerDebug').show();
      }

    } else {
      stage.removeChild(txtLeft);
      txtLeft.visible = false;

      stage.removeChild(txtRight);
      txtRight.visible = false;

      if ($('#controllerDebug:visible').length === 1) {
        $('#controllerDebug').hide();
      }
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
