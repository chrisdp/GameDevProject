var b2d;

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

var  b2d = (function() {

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

  // box2d world setup and boundaries
  var setup = function() {
      world = new b2World(new b2Vec2(0,10), true);
      addDebug();
      // boundaries - floor
      var floorFixture = new b2FixtureDef;
      floorFixture.density = 1;
      floorFixture.restitution = 0;
      floorFixture.shape = new b2PolygonShape;
      floorFixture.shape.SetAsBox(1000 / SCALE, 10 / SCALE);
      var floorBodyDef = new b2BodyDef;
      floorBodyDef.type = b2Body.b2_staticBody;
      floorBodyDef.position.x = -25 / SCALE;
      floorBodyDef.position.y = 582 / SCALE;
      var floor = world.CreateBody(floorBodyDef);
      floor.CreateFixture(floorFixture);
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
      rightFixture.shape.SetAsBox(10 / SCALE, 600 / SCALE);
      var rightBodyDef = new b2BodyDef;
      rightBodyDef.type = b2Body.b2_staticBody;
      rightBodyDef.position.x = 909 / SCALE;
      rightBodyDef.position.y = -25 / SCALE;
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

        // update active actors
        for (i = 0, l = actors.length; i < l; i++) {
          actors[i].update();
        }

        world.Step(TIMESTEP, 10, 10);

        fixedTimestepAccumulator -= STEP;
        world.ClearForces();
        world.m_debugDraw.m_sprite.graphics.clear();
        world.DrawDebugData();
        if (bodies.length > 30) {
          bodiesToRemove.push(bodies[0]);
          bodies.splice(0,1);
        }
      }
    };

  // actor object - this is responsible for taking the body's position and translating it to your easel display object
  var actorObject = function(body, skin) {
      this.body = body;
      this.skin = skin;
      this.update = function() {  // translate box2d positions to pixels
        this.skin.rotation = this.body.GetAngle() * (180 / Math.PI);
        this.skin.x = this.body.GetWorldCenter().x * SCALE;
        this.skin.y = this.body.GetWorldCenter().y * SCALE;
      };
      actors.push(this);
    };

  var spriteMake = function(skin, xScale, yScale) {
    var spriteFixture = new b2FixtureDef;
    spriteFixture.density = 1;
    spriteFixture.restitution = 0.1;
    spriteFixture.shape = new b2PolygonShape;
    spriteFixture.shape.SetAsBox(xScale / SCALE, yScale / SCALE);
    //playerFixture.shape = new b2CircleShape(24 / SCALE);
    var spriteBodyDef = new b2BodyDef;
    spriteBodyDef.type = b2Body.b2_dynamicBody;
    spriteBodyDef.fixedRotation = true;
    spriteBodyDef.position.x = skin.x / SCALE;
    spriteBodyDef.position.y = skin.y / SCALE;
    var sprite = world.CreateBody(spriteBodyDef);
    sprite.CreateFixture(spriteFixture);

    // assign actor
    var actor = new actorObject(sprite, skin);
    sprite.SetUserData(actor);  // set the actor as user data of the body so we can use it later: body.GetUserData()
    bodies.push(sprite);
  };

  // create sprite body shape and assign actor object
  var createPlayer = function(skin) {
    var playerFixture = new b2FixtureDef;
    playerFixture.density = 1;
    playerFixture.restitution = 0.1;
    playerFixture.shape = new b2PolygonShape;
    playerFixture.shape.SetAsBox(14 / SCALE, 23 / SCALE);
    //playerFixture.shape = new b2CircleShape(24 / SCALE);
    var playerBodyDef = new b2BodyDef;
    playerBodyDef.type = b2Body.b2_dynamicBody;
    playerBodyDef.fixedRotation = true;
    playerBodyDef.position.x = skin.x / SCALE;
    playerBodyDef.position.y = skin.y / SCALE;
    var player = world.CreateBody(playerBodyDef);
    player.CreateFixture(playerFixture);

    // assign actor
    var actor = new actorObject(player, skin);
    player.SetUserData(actor);  // set the actor as user data of the body so we can use it later: body.GetUserData()
    bodies.push(player);
  };

  // create bird body shape and assign actor object
  var createBaddy = function(skin) {
    var baddyFixture = new b2FixtureDef;
    baddyFixture.density = 1;
    baddyFixture.restitution = 0.1;
    baddyFixture.shape = new b2PolygonShape;
    baddyFixture.shape.SetAsBox(14 / SCALE, 15 / SCALE);
    //playerFixture.shape = new b2CircleShape(24 / SCALE);
    var baddyBodyDef = new b2BodyDef;
    baddyBodyDef.type = b2Body.b2_dynamicBody;
    baddyBodyDef.fixedRotation = true;
    baddyBodyDef.position.x = skin.x / SCALE;
    baddyBodyDef.position.y = skin.y / SCALE;
    var baddy = world.CreateBody(baddyBodyDef);
    baddy.CreateFixture(baddyFixture);

    // assign actor
    var actor = new actorObject(baddy, skin);
    baddy.SetUserData(actor);  // set the actor as user data of the body so we can use it later: body.GetUserData()
    bodies.push(baddy);
  };

  var movePlayer = function(where) {
    //var player = bodies[0].GetUserData();
    var vel = bodies[0].GetLinearVelocity();
    var forceX = 0;
    var forceY = 0;
    //console.log(vel);
    switch (where) {
    case 'left':
      //console.log(vel.x);
      if (vel.x > -4) {
        forceX = -15;
      }
      break;
    case 'right':
      if (vel.x < 4) {
        forceX = 15;
      }
      break;
    case 'up':
      forceY = -200;
      break;
    case 'down':
      forceY = 100;
      break;
    }
    bodies[0].ApplyForce(new b2Vec2(forceX, forceY), bodies[0].GetWorldCenter());
  };

  return {
    setup: setup,
    addDebug: addDebug,
    update: update,
    spriteMake: spriteMake,
    createPlayer: createPlayer,
    createBaddy: createBaddy,
    movePlayer: movePlayer
  };
})();
