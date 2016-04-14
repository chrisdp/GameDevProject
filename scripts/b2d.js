/* global stage */
/* global Box2D */
/* global debugContext */

var B2d = function() {

  // Box2d vars
  var b2Vec2 = Box2D.Common.Math.b2Vec2;
  var b2BodyDef = Box2D.Dynamics.b2BodyDef;
  var b2Body = Box2D.Dynamics.b2Body;
  var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
  var b2Fixture = Box2D.Dynamics.b2Fixture;
  var b2World = Box2D.Dynamics.b2World;
  var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
  var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
  var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

  // important box2d scale and speed vars
  var SCALE = 30;
  var STEP = 20;
  var TIMESTEP = 1 / STEP;

  var world;
  var lastTimestamp = Date.now();
  var fixedTimestepAccumulator = 0;
  var bodiesToRemove = [];
  var actors = [];
  var bodies = [];
  var stars = [];
  var playerDead = false;
  var points = 0;
  var ship = null;
  var data = null;
  var dataflag = true;
  var offset = 0;
  var player = null;

  // state vars
  var touchingDown = false;
  var touchingFloor = false;
  var sideHit = null;
  var numOfFloor = 0;
  // colision detetors
  var listener = new Box2D.Dynamics.b2ContactListener();

  listener.BeginContact = function(contact) {
    var firstObject = contact.GetFixtureA().GetBody().GetUserData();
    var firstSkin = contact.GetFixtureA().GetBody().GetUserData().skin;
    var firstBody = contact.GetFixtureA().GetBody();
    var secondObject = null;
    var secondSkin = null;
    var secondBody = null;
    if (contact.GetFixtureB().GetBody().GetUserData() !== null) {
      secondObject = contact.GetFixtureB().GetBody().GetUserData();
      secondSkin = contact.GetFixtureB().GetBody().GetUserData().skin;
      secondBody = contact.GetFixtureB().GetBody();

      if (secondObject.id !== null) {
        if (secondObject.id !== 'star' && firstObject.id !== 'star') {
          if (secondObject.id !== 'baddy' && firstObject.id !== 'baddy') {
            if ((secondObject.id === 'floor' || firstObject.id === 'floor') &&
              (secondObject.id === 'player' || firstObject.id === 'player')) {
              touchingFloor = true;
              numOfFloor++;
            }
            touchingDown = true;
          }
        }
      }
    }

    function swapBodies() {
      var tempy = secondSkin;
      secondSkin = firstSkin;
      firstSkin = tempy;

      tempy = secondObject;
      secondObject = firstObject;
      firstObject = tempy;

      tempy = secondBody;
      secondBody = firstBody;
      firstBody = tempy;
    };

    if (secondObject !== null) {

      // ----------------- Checking for NPC's
      if ((firstObject.id === 'baddy') && (secondObject.id === 'player')) {
        swapBodies();
      }

      if ((firstObject.id === 'player') && (secondObject.id === 'baddy')) {
        // player bounds
        var pRightX = firstSkin.x + firstObject.Xdif;
        var pLeftX = firstSkin.x - firstObject.Xdif;
        var pTopY = firstSkin.y - firstObject.Ydif;
        var pBottom = firstSkin.y + firstObject.Ydif;

        // NPC bounds
        var npcRightX = secondSkin.x + secondObject.Xdif;
        var npcLeftX = secondSkin.x - secondObject.Xdif;
        var npcTopY = secondSkin.y - secondObject.Ydif;
        var npcBottom = secondSkin.y + secondObject.Ydif;

        // difference between sides
        var margens = [Math.abs(pRightX - npcLeftX),
          Math.abs(pLeftX - npcRightX), Math.abs(pBottom - npcTopY), Math.abs(pTopY - npcBottom)];

        // index of closest sides at the time of contact
        var side = indexOfSmallest(margens);

        // update state based on what side was hit
        if (side === 0) {
          sideHit = 'left';
          playerDamage(firstSkin);
        } else if (side == 1) {
          sideHit = 'right';
          playerDamage(firstSkin);
        } else if (side == 2) {
          sideHit = 'top';
          kill(secondBody);
          createjs.Sound.play('baddydeath');
          addPoint(40);
        } else if (side == 3) {
          sideHit = 'bottom';
          playerDamage(firstSkin);
        }
      }

      // ----------------- Checking for star items
      if ((firstObject.id === 'star') && (secondObject.id === 'player')) {
        swapBodies();
      }

      if ((firstObject.id === 'player') && (secondObject.id === 'star')) {
        kill(secondBody);
        addPoint(100);
        createjs.Sound.play('point');
      }

      // checking for end of level
      if ((firstObject.id === 'ship') && (secondObject.id === 'player')) {
        swapBodies();
      }

      if ((firstObject.id === 'player') && (secondObject.id === 'ship')) {
        firstObject.skin.visible = false;
        //ship = secondObject.skin;
        stopPlayer();
        ship.gotoAndPlay('rocketStart');
        ship.addEventListener('animationend', flyShip);
        ship.endOfLevel = true;
      }
    }
  };

  function flyShip() {
    ship.removeEventListener('animationend', flyShip);
    ship.fly = true;
  };

  // returns the index of the smallest value in the array
  function indexOfSmallest(a) {
    var lowest = 0;
    for (var i = 1; i < a.length; i++) {
      if (a[i] < a[lowest]) {
        lowest = i;
      }
    }
    return lowest;
  };

  // add the passed body to the array of bodies to remove from the game
  function kill(body) {
    bodiesToRemove.push(body);
  };

  // remove HP from player and handle 0 HP
  function playerDamage() {
    var hp = player.GetUserData().skin.hp-- - 1;
    createjs.Sound.play('playerdamage');
    if (hp <= 0) {
      kill(player);
      playerDead = true;
      createjs.Sound.play('gameover1');
    } else {
      var forceX = 0;
      var forceY = 0;
      if (sideHit === 'left') {
        forceX = -100;
        forceY = -100;
      } else if (sideHit === 'right') {
        forceX = 100;
        forceY = -100;
      }
      stopPlayer();
      player.ApplyForce(new b2Vec2(forceX, forceY), player.GetWorldCenter());
    }
  };

  function addPoint(point) {
    var ammount = (point === undefined) ? 10 : point;
    points += ammount;
  };

  // event for when items stop touching
  listener.EndContact = function(contact) {
    // check for living player
    if (!playerDead) {
      // only act on bodies with user data
      if (contact.GetFixtureA().GetBody().GetUserData() !== null) {
        // store coliding objects id's
        var firstObjectID = contact.GetFixtureA().GetBody().GetUserData().id;
        var secondObjectID = null;
        if (contact.GetFixtureB().GetBody().GetUserData() !== null) {
          secondObjectID = contact.GetFixtureB().GetBody().GetUserData().id;
          if (secondObjectID !== null && (secondObjectID !== 'baddy' || firstObjectID !== 'baddy') &&
          (secondObjectID !== 'ship' || firstObjectID !== 'ship')) {
            // part of a fix alowing the user to touch
            // more then one platform and not lose the
            // ability to jump
            if ((secondObjectID === 'floor' || firstObjectID === 'floor') && (secondObjectID === 'player' || firstObjectID === 'player')) {
              numOfFloor--;
              if (numOfFloor <= 0) {
                touchingFloor = false;
              }
            }
            if (!touchingFloor) {
              touchingDown = false;
            }
          }
        }
      }
    }
  };

  listener.PostSolve = function(contact, impulse) {
    // used after colisions and allows access to corrective data, AKA impact force
  };

  listener.PreSolve = function(contact, oldManifold) {
    // checks before the actual contact happens
    // can be used for things like oneway platforms
    if (!playerDead) {
      // only act on bodies with user data
      if (contact.GetFixtureA().GetBody().GetUserData() !== null) {
        // store coliding objects id's
        var firstObjectID = contact.GetFixtureA().GetBody().GetUserData().id;
        var secondObjectID = null;
        if (contact.GetFixtureB().GetBody().GetUserData() !== null) {
          secondObjectID = contact.GetFixtureB().GetBody().GetUserData().id;
          if (secondObjectID !== null) {
            if ((secondObjectID === 'star') && (firstObjectID === 'player')) {
              contact.SetEnabled(false);
            } else if ((secondObjectID === 'player') && (firstObjectID === 'star')) {
              contact.SetEnabled(false);
            } else if ((secondObjectID === 'ship') && (firstObjectID === 'player')) {
              contact.SetEnabled(false);
            } else if ((secondObjectID === 'player') && (firstObjectID === 'ship')) {
              contact.SetEnabled(false);
            }
          }
        }
      }
    }
  };

  // used to construct a static body for platforms
  var platformMake = function(sprite, platform) {

    var newFixture = new b2FixtureDef;
    newFixture.density = 1;
    newFixture.restitution = platform.restitution;
    newFixture.shape = new b2PolygonShape;
    newFixture.shape.SetAsBox(platform.width / SCALE, platform.height / SCALE);
    var newBodyDef = new b2BodyDef;
    newBodyDef.type = b2Body.b2_staticBody;
    newBodyDef.position.x = sprite.x / SCALE;
    newBodyDef.position.y = sprite.y / SCALE;
    var floor = world.CreateBody(newBodyDef);
    floor.CreateFixture(newFixture);

    // assign actor for floor
    var actor = new actorObject(floor, sprite, platform);

    floor.SetUserData(actor);
  };

  // box2d world setup and boundaries
  var setup = function(platform, spriteId) {
    console.log('>> phsycs starting');
    world = new b2World(new b2Vec2(0,10), true);
    world.SetContactListener(listener);
    addDebug();
    // boundaries - left
    var leftFixture = new b2FixtureDef;
    leftFixture.shape = new b2PolygonShape;
    leftFixture.shape.SetAsBox(10 / SCALE, 600 / SCALE);
    var leftBodyDef = new b2BodyDef;
    leftBodyDef.type = b2Body.b2_staticBody;
    leftBodyDef.position.x = -9 / SCALE;
    leftBodyDef.position.y = -25 / SCALE;
    var left = world.CreateBody(leftBodyDef);
    left.CreateFixture(leftFixture);
    // boundaries - right

    var rightFixture = new b2FixtureDef;
    rightFixture.shape = new b2PolygonShape;
    rightFixture.shape.SetAsBox(10 / SCALE, 300 / SCALE);
    var rightBodyDef = new b2BodyDef;
    rightBodyDef.type = b2Body.b2_staticBody;
    rightBodyDef.position.x = 3587 / SCALE;
    rightBodyDef.position.y = 300 / SCALE;
    var right = world.CreateBody(rightBodyDef);
    right.CreateFixture(rightFixture);
  };

  // box2d debugger
  var addDebug = function() {
    var debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(debugContext);
    debugDraw.SetDrawScale(SCALE);
    debugDraw.SetFillAlpha(0.7);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    world.SetDebugDraw(debugDraw);
  };

  // box2d update function. delta time is used to avoid differences in simulation if frame rate drops
  var update = function() {
    var now = Date.now();
    var dt = now - lastTimestamp;
    fixedTimestepAccumulator += dt;
    lastTimestamp = now;

    while (fixedTimestepAccumulator >= STEP) {

      // remove bodies before world timestep
      for (var i = 0, l = bodiesToRemove.length; i < l; i++) {
        removeActor(bodiesToRemove[i].GetUserData());
        bodiesToRemove[i].SetUserData(null);
        world.DestroyBody(bodiesToRemove[i]);
      }
      bodiesToRemove = [];
      var forceX;
      var forceY;
      var move;
      for (i = 0; i < actors.length; i++) {
        forceX = 0;
        forceY = 0;
        move = false;
        var vel = actors[i].body.GetLinearVelocity();
        if (actors[i].id === 'baddy') {
          if (actors[i].skin.direction) {
            if (actors[i].skin.patOne < actors[i].skin.x) {
              if (actors[i].skin.currentAnimation !== 'moveLeft') {
                actors[i].skin.gotoAndPlay('moveLeft');
              }
              if (vel.x > -1) {
                forceX = -3;
                move = true;
              }
            } else {
              actors[i].skin.direction = false;
            }
          } else {
            if (actors[i].skin.patTwo > actors[i].skin.x) {
              if (actors[i].skin.currentAnimation !== 'moveRight') {
                actors[i].skin.gotoAndPlay('moveRight');
              }
              if (vel.x < 1) {
                forceX = 3;
                move = true;
              }
            } else {
              actors[i].skin.direction = true;
            }
          }
        }
        if (actors[i].id === 'ship') {
          if (ship.fly) {
            if (vel.y > -2) {
              forceY = -3;
              move = true;
            }
          }
        }
        if (move) {
          actors[i].body.ApplyForce(new b2Vec2(forceX, forceY), actors[i].body.GetWorldCenter());
        }
      }

      // update active actors
      for (i = 0, l = actors.length; i < l; i++) {
        actors[i].update();
      }

      world.Step(TIMESTEP, 10, 10);

      fixedTimestepAccumulator -= STEP;
      world.ClearForces();
      world.m_debugDraw.m_sprite.graphics.clear();

      if (!playerDead) {
        offset = 0;
        for (i = 0; i < actors.length; i++) {
          if (actors[i].id === 'player') {
            offset = ((actors[i].skin.x + debugContext.canvas.width / 2) - 900);
            i = actors.length;
          }
        }
      }

      if (offset > 0 && offset < 2680) {
        debugContext.save();
        debugContext.clearRect(0,0, debugContext.canvas.width, debugContext.canvas.height);
        debugContext.translate(-offset, 0);
      } else if (offset > 2680) {
        debugContext.save();
        debugContext.clearRect(0,0, debugContext.canvas.width, debugContext.canvas.height);
        debugContext.translate(-2680, 0);
      }

      world.DrawDebugData();
      debugContext.restore();

      if (bodies.length > 30) {
        bodiesToRemove.push(bodies[0]);
        bodies.splice(0,1);
      }
    }
  };

  // actor object - this is responsible for taking the body's position and translating it to your easel display object
  function actorObject(body, skin, data) {
    this.body = body;
    this.skin = skin;
    this.id = data.id;
    this.Xdif = data.width;
    this.Ydif = data.height;
    this.update = function() {
      // translate box2d positions to pixels
      this.skin.rotation = this.body.GetAngle() * (180 / Math.PI);
      this.skin.x = this.body.GetWorldCenter().x * SCALE;
      this.skin.y = this.body.GetWorldCenter().y * SCALE;
    };
    actors.push(this);
  };

  var spriteMake = function(skin, data) {
    var spriteFixture = new b2FixtureDef;
    spriteFixture.density = 1;
    spriteFixture.restitution = 0;
    spriteFixture.shape = new b2PolygonShape;
    spriteFixture.shape.SetAsBox(data.width / SCALE, data.height / SCALE);

    var sprite = bodieMake(skin, spriteFixture);

    // assign actor
    var actor = new actorObject(sprite, skin, data);

    sprite.SetUserData(actor);  // set the actor as user data of the body so we can use it later:
    bodies.push(sprite);
  };

  var starMake = function(skin, data) {
    var spriteFixture = new b2FixtureDef;
    spriteFixture.density = 1;
    spriteFixture.restitution = data.restitution;
    spriteFixture.shape = new b2PolygonShape;
    spriteFixture.shape.SetAsBox(data.width / SCALE, data.height / SCALE);

    var sprite = bodieMake(skin, spriteFixture);

    // assign actor
    var actor = new actorObject(sprite, skin, data);

    // set the actor as user data of the body so we can use it later: body.GetUserData()
    sprite.SetUserData(actor);
    stars.push(sprite);
  };

  function bodieMake(skin, fixture) {
    var spriteBodyDef = new b2BodyDef;
    spriteBodyDef.type = b2Body.b2_dynamicBody;
    spriteBodyDef.fixedRotation = true;
    spriteBodyDef.position.x = skin.x / SCALE;
    spriteBodyDef.position.y = skin.y / SCALE;

    var sprite = world.CreateBody(spriteBodyDef);
    sprite.CreateFixture(fixture);

    return sprite;
  };

  var movePlayer = function(where, speed) {
    var vel = player.GetLinearVelocity();
    var forceX = 0;
    var forceY = 0;
    var maxVel = 4;
    var maxNegVel = -4;

    if (speed !== undefined) {
      maxVel = speed;
      maxNegVel = speed;
    }

    switch (where) {
    case 'left':
      if (vel.x > maxNegVel) {
        forceX = -20;
      }
      break;
    case 'right':
      if (vel.x < maxVel) {
        forceX = 20;
      }
      break;
    case 'up':
      if ((touchingDown) && (vel.y > -3)) {
        forceY = -250;
        createjs.Sound.play('jump');
        if (vel.y < -3) {
          touchingDown = false;
        }
      }
      break;
    case 'down':
      forceY = 100;
      break;
    }
    forcePlayer(forceX, forceY);
  };

  function forcePlayer(forceX, forceY) {
    player.ApplyForce(new b2Vec2(forceX, forceY), player.GetWorldCenter());
  }

  var playerData = function() {

    if (dataflag) {
      data = {
        pos: {
        x: (playerDead) ? 0 : player.GetUserData().skin.x,
        y: (playerDead) ? 0 : player.GetUserData().skin.y
      },
        hitPoints: (playerDead) ? 0 : player.GetUserData().skin.hp,
        vel: (playerDead) ? {x: 0, y: 0} : player.GetLinearVelocity(),
        touchingDown: touchingDown,
        touchingFloor: touchingFloor,
        sideHit: sideHit,
        points: points,
        endOfLevel: ship.endOfLevel
      };
      if (playerDead) {
        dataflag = false;
      }
    }
    return data;
  };

  // remove actor and it's skin object
  function removeActor(actor) {
    stage.removeChild(actor.skin);
    actors.splice(actors.indexOf(actor),1);
  };

  var bodysPrint = function() {
    for (var i = 0; i < bodies.length; i++) {
      if (bodies[i].GetUserData().id === 'baddy') {
        bodies[i].m_mass = 5;
        bodies[i].m_invMass = 5;
      } else if (bodies[i].GetUserData().id === 'ship') {
        ship = bodies[i].GetUserData().skin;
      } else if (bodies[i].GetUserData().id === 'player') {
        player = bodies[i];
      }
    }
    console.log(bodies);
  };

  var clearWorld = function() {
    setup();
  };

  var stopPlayer = function() {
    player.SetLinearVelocity(new b2Vec2(0,0));
    player.SetAngularVelocity(0);
  };

  var defaults = function() {
    // important box2d scale and speed vars
    SCALE = 30;
    STEP = 20;
    TIMESTEP = 1 / STEP;

    lastTimestamp = Date.now();
    fixedTimestepAccumulator = 0;
    bodiesToRemove = [];
    actors = [];
    bodies = [];
    stars = [];
    playerDead = false;
    points = 0;

    // state vars
    touchingDown = false;
    touchingFloor = false;
    sideHit = null;
    numOfFloor = 0;
    dataflag = true;
  };

  var playerMass = function(mass, iMass) {
    player.m_mass = mass;
    player.m_invMass = iMass;
  };

  return {
    setup: setup,
    addDebug: addDebug,
    update: update,
    spriteMake: spriteMake,
    starMake: starMake,
    movePlayer: movePlayer,
    playerData: playerData,
    platformMake: platformMake,
    bodysPrint: bodysPrint,
    clearWorld: clearWorld,
    defaults: defaults,
    playerMass: playerMass,
    stopPlayer: stopPlayer
  };
};
