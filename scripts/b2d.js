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
    var secondObject = null;
    var secondSkin = null;
    if (contact.GetFixtureB().GetBody().GetUserData() !== null) {
      secondObject = contact.GetFixtureB().GetBody().GetUserData();
      secondSkin = contact.GetFixtureB().GetBody().GetUserData().skin;
      //console.log(contact.GetFixtureA().GetBody().GetUserData());
      //console.log(contact.GetFixtureB().GetBody().GetUserData());

      if (secondObject.id !== null) {
        if (secondObject.id === 'floor') {
          touchingFloor = true;
          numOfFloor++;
          console.log(numOfFloor);
        }
        touchingDown = true;
      }
    }

    if (secondObject !== null) {
      if ((firstObject.id === 'player') &&  (secondObject.id === 'baddy')) {
        //console.log('player hit the baddy!!!!!');
        var pRightX = firstSkin.x + firstObject.Xdif;
        var pLeftX = firstSkin.x - firstObject.Xdif;
        var pTopY = firstSkin.y - firstObject.Ydif;
        var pBottom = firstSkin.y + firstObject.Ydif;
        //console.log('P right: ' + pRightX + ' left: ' + pLeftX + ' top: ' + pTopY + ' bottom: ' + pBottom);

        //console.log(firstSkin.x + ' ' + firstSkin.y);
        //console.log(secondSkin.x + ' ' + secondSkin.y);
        var npcRightX = secondSkin.x + secondObject.Xdif;
        var npcLeftX = secondSkin.x - secondObject.Xdif;
        var npcTopY = secondSkin.y - secondObject.Ydif;
        var npcBottom = secondSkin.y + secondObject.Ydif;

        var left = (pRightX - npcLeftX);
        var right = (pLeftX - npcRightX);
        var top = (pBottom - npcTopY);
        var bottom = (pTopY - npcBottom);
        var margin = 7;
        var precision = 4;
        //console.log('N right: ' + npcRightX + ' left: ' + npcLeftX + ' top: ' + npcTopY + ' bottom: ' + npcBottom);

        //console.log('left margin: ' + left + ' right margin ' + right + ' top margin ' + top + ' bottom margin ' + bottom);
        //bodies[0].GetUserData().skin.x;
        if ((left < margin) && (left > -Math.abs(margin))) {
          //console.log('hit NPC on the left -- pX: ' + pRightX + ' npcX: ' + npcLeftX + ' = ' + (pRightX - npcLeftX));
          sideHit = 'left';
        } else if ((right < margin) && (right > -Math.abs(margin))) {
          //console.log('hit NPC on the right -- pX: ' + pLeftX + ' npcX: ' + npcRightX + ' = ' + (pLeftX - npcRightX));
          sideHit = 'right';
        } else if ((top < margin) && (top > -Math.abs(margin))) {
          //console.log('hit NPC on the top');
          sideHit = 'top';
        } else if ((bottom < margin) && (bottom > -Math.abs(margin))) {
          //console.log('hit NPC on the bottom');
          sideHit = 'bottom';
        } else {
          sideHit = 'out of margin: ' + margin +
            '\nleft margin: ' + left.toFixed(precision) + ' right margin ' + right.toFixed(precision) +
            '\ntop margin ' + top.toFixed(precision) + ' bottom margin ' + bottom.toFixed(precision);
        }
      }
    }
  };

  listener.EndContact = function(contact) {
    var firstObjectID = contact.GetFixtureA().GetBody().GetUserData().id;
    var secondObjectID = null;
    if (contact.GetFixtureB().GetBody().GetUserData() !== null) {
      secondObjectID = contact.GetFixtureB().GetBody().GetUserData().id;
      if (secondObjectID !== null) {
        if (secondObjectID === 'floor') {
          numOfFloor--;
          console.log(numOfFloor);
          if (numOfFloor <= 1) {
            touchingFloor = false;
          }
        }
        if (!touchingFloor) {
          touchingDown = false;
        }
        //console.log(touchingDown);
      }
    }
  };

  listener.PostSolve = function(contact, impulse) {
    //console.log(impulse);
  };

  listener.PreSolve = function(contact, oldManifold) {
    //console.log(contact);
  };

  var platformMake = function(sprite, platform) {

    var newFixture = new b2FixtureDef;
    newFixture.density = 1;
    newFixture.restitution = 0;
    newFixture.shape = new b2PolygonShape;
    newFixture.shape.SetAsBox(platform.width / SCALE, platform.height / SCALE);
    var newBodyDef = new b2BodyDef;
    newBodyDef.type = b2Body.b2_staticBody;
    newBodyDef.position.x = sprite.x / SCALE;
    newBodyDef.position.y = sprite.y / SCALE;
    var floor = world.CreateBody(newBodyDef);
    floor.CreateFixture(newFixture);

    // assign actor for floor
    var actor = new actorObject(floor, sprite, platform.id);
    actor.id = platform.id;
    actor.Xdif = platform.width;
    actor.Ydif = platform.height;
    floor.SetUserData(actor);
  };

  // box2d world setup and boundaries
  var setup = function(platform, spriteId) {
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
    //if (bodies[0] != undefined) {
    if (false) {

    }
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

      for (i = 0; i < actors.length; i++) {
        var force = 0;
        var vel = actors[i].body.GetLinearVelocity();
        if (actors[i].id === 'baddy') {
          if (actors[i].skin.direction) {
            if (actors[i].skin.patOne < actors[i].skin.x) {
              //console.log('pat one is less then x');
              if (actors[i].skin.currentAnimation !== 'moveLeft') {
                actors[i].skin.gotoAndPlay('moveLeft');
              }
              if (vel.x > -1) {
                force = -10;
              }
            } else {
              actors[i].skin.direction = false;
            }
          } else {
            if (actors[i].skin.patTwo > actors[i].skin.x) {
              //console.log('pat two : ' + actors[i].skin.patTwo + ' is grater then x: ' + actors[i].skin.x);
              //console.log(vel);
              if (actors[i].skin.currentAnimation !== 'moveRight') {
                actors[i].skin.gotoAndPlay('moveRight');
              }
              if (vel.x < 1) {
                //console.log('changed force');
                force = 10;
              }
            } else {
              actors[i].skin.direction = true;
            }
          }
          actors[i].body.ApplyForce(new b2Vec2(force, 0), actors[i].body.GetWorldCenter());
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

      var offset = 0;
      for (i = 0; i < actors.length; i++) {
        if (actors[i].id === 'player') {
          offset = ((actors[i].skin.x + debugContext.canvas.width / 2) - 900);
          i = actors.length;
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
  var actorObject = function(body, skin, id) {
    this.id = id;
    this.body = body;
    this.skin = skin;
    this.update = function() {  // translate box2d positions to pixels
      this.skin.rotation = this.body.GetAngle() * (180 / Math.PI);
      this.skin.x = this.body.GetWorldCenter().x * SCALE;
      this.skin.y = this.body.GetWorldCenter().y * SCALE;
    };
    actors.push(this);
  };

  var spriteMake = function(skin, xScale, yScale, spriteId) {
    var spriteFixture = new b2FixtureDef;
    spriteFixture.density = 1;
    spriteFixture.restitution = 0;
    spriteFixture.shape = new b2PolygonShape;
    spriteFixture.shape.SetAsBox(xScale / SCALE, yScale / SCALE);

    var spriteBodyDef = new b2BodyDef;
    spriteBodyDef.type = b2Body.b2_dynamicBody;
    spriteBodyDef.fixedRotation = true;
    spriteBodyDef.position.x = skin.x / SCALE;
    spriteBodyDef.position.y = skin.y / SCALE;
    var sprite = world.CreateBody(spriteBodyDef);

    sprite.CreateFixture(spriteFixture);
    //    spriteFixture = new b2FixtureDef;
    //    spriteFixture.density = 0;
    //    spriteFixture.restitution = 0;
    //    spriteFixture.shape = new b2PolygonShape;
    //    spriteFixture.shape.SetAsBox(0.5, 0.2, new b2Vec2(1.2, 3.4));
    //    spriteFixture.shape.m_centroid.x = 10;
    //    console.log(spriteFixture);
    //    sprite.CreateFixture(spriteFixture);

    // assign actor
    var actor = new actorObject(sprite, skin, spriteId);
    actor.id = spriteId;
    actor.Xdif = xScale;
    actor.Ydif = yScale;
    sprite.SetUserData(actor);  // set the actor as user data of the body so we can use it later: body.GetUserData()
    bodies.push(sprite);
  };

  var movePlayer = function(where, speed) {
    //var player = bodies[0].GetUserData();
    var vel = bodies[0].GetLinearVelocity();
    var forceX = 0;
    var forceY = 0;
    var maxVel = 4;
    var maxNegVel = -4;

    if (speed !== undefined) {
      maxVel = speed;
      maxNegVel = speed;
    }

    //console.log(maxVel);
    //console.log(vel);
    switch (where) {
    case 'left':
      //console.log(vel.x);
      if (vel.x > maxNegVel) {
        //console.log('move left passed');
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
      }
      break;
    case 'down':
      forceY = 100;
      break;
    }
    bodies[0].ApplyForce(new b2Vec2(forceX, forceY), bodies[0].GetWorldCenter());
  };

  var playerData = function() {

    var data = {
      pos: {
        x: bodies[0].GetUserData().skin.x,
        y: bodies[0].GetUserData().skin.y
      },
      vel: bodies[0].GetLinearVelocity(),
      touchingDown: touchingDown,
      touchingFloor: touchingFloor,
      sideHit: sideHit
    };

    return data;
    //debugDraw.DrawString(5, m_textLine,
    //                       'Position:%.3f,%.3f Angle:%.3f', pos.x, pos.y, angle * RADTODEG);
    //m_textLine += 15;
    //m_debugDraw.DrawString(5, m_textLine,
    //                         'Velocity:%.3f,%.3f Angular velocity:%.3f', vel.x, vel.y, angularVel * RADTODEG);
    //m_textLine += 15;
  };

  return {
    setup: setup,
    addDebug: addDebug,
    update: update,
    spriteMake: spriteMake,
    movePlayer: movePlayer,
    playerData: playerData,
    platformMake: platformMake
  };
};
