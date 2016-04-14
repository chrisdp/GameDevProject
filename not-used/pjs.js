
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update, render: render});

function preload() {
  game.load.image('sky', 'assets/sky.png');
  game.load.image('ground', 'assets/platform.png');
  game.load.image('star', 'assets/star.png');
  game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
  game.load.image('heart','assets/heart.png');
  game.load.image('firstaid','assets/firstaid.png');
  game.load.image('bomb', 'assets/bomb.png');
  game.load.game.load.spritesheet('explosion','assets/explosion.png',20,19);
}

var platforms;
var player;
var cursors;
var wasd;
var stars;
var score = 0;
var win = 0;
var scoreText;
var hearts;
var hitPoints;
var firstaid;
var bombs;
var stars;
var explosion;
var hurt;
var flashRate;
var arrSpawnLoc = [];

function create() {

  isExplosion = false;
  hitPoints = 3;
  // create input object
  cursors = game.input.keyboard.createCursorKeys();
  wasd = {
    up: game.input.keyboard.addKey(Phaser.Keyboard.W),
    down: game.input.keyboard.addKey(Phaser.Keyboard.S),
    left: game.input.keyboard.addKey(Phaser.Keyboard.A),
    right: game.input.keyboard.addKey(Phaser.Keyboard.D),
  };
  hurt = false;
  // enable Arcade Physics system
  game.physics.startSystem(Phaser.Physics.ARCADE);

  // add background
  game.add.sprite(0, 0, 'sky');

  // The platforms group contains the ground and the 2 ledges we can jump on
  platforms = game.add.group();

  // enable physicis for any object that is created in this group
  platforms.enableBody = true;
  platforms.physicsBodyType = Phaser.Physics.ARCADE;
  game.physics.arcade.enable(platforms);

  // create the ground
  var ground = platforms.create(0, game.world.height - 64, 'ground');

  // scale it to fit width of game
  ground.scale.setTo(2, 2);

  // stop it from falling when jumped on
  ground.body.immovable = true;
  ground.body.moves = false;

  // create 2 ledges
  var ledge = platforms.create(400, 400, 'ground');
  ledge.body.immovable = true;
  ledge.body.moves = false;
  ledge = platforms.create(-150, 250, 'ground');
  ledge.body.immovable = true;
  ledge.body.moves = false;

  //game.add.sprite(0, 0, 'star');

  // player and its settingd
  player = game.add.sprite(32, game.world.height - 150, 'dude');

  // enable player physics
  game.physics.arcade.enable(player);

  // player physics properties
  player.body.bounce.y = 0.15;
  player.body.gravity.y = 300;
  player.body.collideWorldBounds = true;

  // walking animations for right and left
  player.animations.add('left', [0,1,2,3], 10, true);
  player.animations.add('right', [5,6,7,8], 10, true);

  stars = game.add.group();
  stars.enableBody = true;

  bombs = game.add.group();
  bombs.enableBody = true;
  bombs.physicsBodyType = Phaser.Physics.ARCADE;

  // spawn locations
  for (var i = 0; i < 12; i++) {
    arrSpawnLoc.push(i * 70);
  }

  spawnCollectables();

  //hearts
  hearts = game.add.group();
  hearts.enableBody = true;
  healthPacks = game.add.group();
  healthPacks.enableBody = true;
  healthPacks.physicsBodyType = Phaser.Physics.ARCADE;
  firstaid = healthPacks.create(16, 16, 'firstaid');
  //game.physics.arcade.enable(firstaid);
  //firstaid.enableBody = true;

  firstaid.body.gravity.y = 6;
  firstaid.body.bounce.y = 0;
  // scoreboard
  scoreText = game.add.text(16,16,'Score: 0', {fontSize: '32px', fill: '#000'});
}
var speedTime = 1600;
var counter = 0;
var hurtCounter = 0;
var nextHeathPack = 3000;

function update() {

  if (counter == speedTime) {
    spawnCollectables();
    speedTime *= 0.95;
    speedTime = Math.floor(speedTime);
    counter = 0;
    console.log(speedTime);
  }
  if (hurtCounter == 200) {
    hurt = false;
    hurtCounter = 0;
  }
  if (nextHeathPack == 0) {
    spawnFirstAid();
  } else {
    nextHeathPack--;
  }

  // collide the player and the stars with the platforms
  game.physics.arcade.collide(player, platforms);
  game.physics.arcade.collide(stars, platforms);
  game.physics.arcade.collide(healthPacks, platforms);
  game.physics.arcade.overlap(player, stars, collectStar, null, this);
  game.physics.arcade.collide(bombs, platforms);
  //console.log(game.physics.arcade.collide(bombs, platforms, bombLife, null, this));
  //console.log(game.physics.body.touching.down(bombs, platforms, bombLife, null, this));
  bombs.forEachAlive(bounceCheck, this);
  stars.forEachAlive(bounceCheck, this);
  /*
  for (i = 0; i < bombs.length; i++) {
      //var bomb = ;
      if (bombs.getChildAt(i).body.touching.down) {
          bombLife(bombs.getChildAt(i));
      }
      // TODO need to work with tinting for flash.... not working >.>
      //console.log(bombs.getChildAt(i).bombLife);
      if (bombs.getChildAt(i).bombLife <= 1) {
          console.log("fuck...");
          var tempy = bombs.getChildAt(i).flash++;
          if (tempy == 200){
              bombFlash(bombs.getChildAt(i));
              bombs.getChildAt(i).flash = 0;
          }
          if (tempy == 100) {
              bombs.getChildAt(i).tint = 0xffffff;
          }

      }
      //console.log(game.physics.arcade.overlap(bombs.getChildAt(i), this.platforms, bombLife, null, this));
  }*/
  /*
  for (i = 0; i < stars.length; i++) {
      if (stars.getChildAt(i).body.touching.down) {
          starLife(stars.getChildAt(i));
      }
  }*/

  //console.log(game.physics.arcade.collide(platforms, bombs, bombLife, null, this));
  game.physics.arcade.overlap(player, bombs, collectBomb, null, this);
  game.physics.arcade.overlap(player,healthPacks,collectHealth, null, this);

  //UPDATE HEALTH
  hearts.removeAll(true, true);
  for (var i = 0; i < hitPoints; i ++) {
    var heart = hearts.create(650 + (i * 50),0,'heart');
  }

  // reset the players velocity (movemnet)
  player.body.velocity.x = 0;

  if (cursors.left.isDown || wasd.left.isDown) {
    player.body.velocity.x = -150;
    player.animations.play('left');
  } else if (cursors.right.isDown || wasd.right.isDown) {
    player.body.velocity.x = 150;
    player.animations.play('right');
  } else {
    player.animations.stop();
    if (!hurt) {
      player.frame = 4;
    }else {
      player.frame = 9;
    }
  }

  if ((cursors.up.isDown && player.body.touching.down) || (wasd.up.isDown && player.body.touching.down)) {
    player.body.velocity.y = -350;
  }
  counter ++;
  hurtCounter ++;
  flashRate++;
}

function render() {

  // Display
  //bombs.forEachAlive(renderGroup, this);
  //stars.forEachAlive(renderGroup, this);
  renderGroup(player);
  renderGroup(firstaid);
  //game.debug.spriteBounds(bombs);
  //game.debug.spriteCorners(bombs, true, true);

}

function renderGroup(member) {
  game.debug.body(member);
  //game.debug.spriteCorners(member, true, true);
}

function collectStar(player, star) {

  // remove the star
  star.kill();

  // add and update score
  score += 10;
  win++;
  if (win == stars.length) {
    scoreText.text = 'You WIN!!! ';
  } else {
    scoreText.text = 'Score: ' + score;
  }
}

function collectBomb(player, bomb) {
  explode(bomb);
  hitPoints --;
  hurt = true;
  game.add;
  console.log(hitPoints);
  bomb.kill();
  if (hitPoints == 0) {
    player.kill();
    scoreText.text = 'Game Over! Your score was: ' + score;
  }
  //hearts.remove(hearts.getIndex(hitPoints - 1));
}

function explode(bomb) {
  explosion = game.add.sprite(bomb.body.x,bomb.body.y,'explosion');
  explosion.enableBody = true;
  explosion.scale.x = 3;
  explosion.scale.y = 3;
  explosion.animations.add('explode',[0,1,2,3,4,5,6,7],10,false);
  explosion.animations.play('explode');
  explosion.events.onAnimationComplete.add(function() {
    explosion.kill();
  },this);
}

function bounceCheck(member) {
  if (member.body.touching.down) {
    member.bounceCount--;
    //console.log(member.bounceCount);
    if (member.bounceCount == 0) {
      if (member.myGroupType == 'bomb') {
        explode(member);
      } else if (member.myGroupType == 'star') {
        // TODO change this to a differnt animation...
        explode(member);
      }
      member.kill();
    }
  }

  if (member.bounceCount <= 1 && member.alive == true) {
    //console.log("first level flash" + member.flash);

    if (member.flash == 30) {
      member.tint = 0xFF0000;
    } else if (member.flash == 60) {
      member.tint = 0xffffff;
      member.flash = 0;
    }
    member.flash++;
  }

}

function collectHealth(player, firstaid) {
  if (hitPoints < 3) {
    hitPoints ++;
    firstaid.kill();
  }
}

function spawnCollectables() {
  var bombCount = 0;
  var thisOrThat;

  while (bombCount > 4 || bombCount < 3) {
    bombCount = 0;
    thisOrThat = [];
    for (var i = 0; i < 12; i++) {
      var tempy = Math.floor((Math.random() * 10) + 1);
      if (tempy < 3) {
        thisOrThat.push(true);
        bombCount++;
      } else {
        thisOrThat.push(false);
      }
    }
  }
  // crate 12 stars and space them evenly apart
  for (var i = 0; i < 12; i++) {
    // create star inside the stars group

    var bomb;
    var star;

    if (thisOrThat[i]) {
      bomb = bombs.create(arrSpawnLoc[i], -38, 'bomb');
      // let gravity do its thing
      bomb.body.gravity.y = 6;
      // give a random bounce value
      bomb.body.bounce.y = 0.7 + Math.random() * 0.2;
      // bomb bounce limit and add flash counter
      bomb.bounceCount = 4;
      bomb.flash = 0;
      bomb.myGroupType = 'bomb';
      //bombCount++;
    } else {
      star = stars.create(arrSpawnLoc[i], -30, 'star');
      // let gravity do its thing
      star.body.gravity.y = 6;
      // give a random bounce value
      star.body.bounce.y = 0.7 + Math.random() * 0.2;
      star.bounceCount = 4;
      star.flash = 0;
      star.myGroupType = 'star';
    }
  }
}

function spawnFirstAid() {
  firstaid = healthPacks.create(Math.floor(Math.random() * (800 + 1)), -40, 'firstaid');
  firstaid.body.gravity.y = 6;
  firstaid.body.bounce.y = 0;
  nextHeathPack = Math.floor(Math.random() * (4000 - 2000 + 1) + 2000);
  console.log(nextHeathPack);
}
