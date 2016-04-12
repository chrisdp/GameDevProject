var worldData = {
    levelOne: {
      players: [
        {
          spawnX: 40,
          spawnY: -3000,
          animation: 'dudeIdile',
          id: 'player',
          width: 14,
          height: 23,
          hp: 10,
          points: 0
        }

      ],
      baddys: [
        {
          spawnX: 300,
          spawnY: 300,
          patOne: 280,
          patTwo: 520,
          id: 'baddy',
          animation: 'moveLeft',
          width: 14,
          height: 15
        },
        {
          spawnX: 500,
          spawnY: 500,
          patOne: 100,
          patTwo: 1000,
          id: 'baddy',
          animation: 'moveLeft',
          width: 14,
          height: 15
        },
        {
          spawnX: 1088,
          spawnY: 466,
          patOne: 1025,
          patTwo: 1185,
          id: 'baddy',
          animation: 'moveLeft',
          width: 14,
          height: 15
        },
        // pit baddys
        {
          spawnX: 2300,
          spawnY: 466,
          patOne: 2225,
          patTwo: 2440,
          id: 'baddy',
          animation: 'moveLeft',
          width: 14,
          height: 15
        },
        {
          spawnX: 2500,
          spawnY: 466,
          patOne: 2470,
          patTwo: 2570,
          id: 'baddy',
          animation: 'moveLeft',
          width: 14,
          height: 15
        },

        {
          spawnX: 2600,
          spawnY: 466,
          patOne: 2600,
          patTwo: 2750,
          id: 'baddy',
          animation: 'moveLeft',
          width: 14,
          height: 15
        }
      ],
      platforms: [
        { // main floor
          spawnX: 1790,
          spawnY: 590,
          width: 1800,
          height: 10,
          id: 'floor',
          restitution: 0,
          animation: 'platform'
        },
        { // p1
          spawnX: 400,
          spawnY: 300,
          width: 200,
          height: 10,
          id: 'floor',
          restitution: 0,
          animation: 'platform'
        },
        { // p2
          spawnX: 200,
          spawnY: 488,
          width: 500,
          height: 10,
          id: 'floor',
          restitution: 0,
          animation: 'platform'
        },
        { // p3
          spawnX: 100,
          spawnY: 400,
          width: 150,
          height: 10,
          id: 'floor',
          restitution: 0,
          animation: 'platform'
        },
        { // p4
          spawnX: 850,
          spawnY: 200,
          width: 100,
          height: 10,
          id: 'floor',
          restitution: 0,
          animation: 'platform'
        },
        { // p5
          spawnX: 330,
          spawnY: 100,
          width: 100,
          height: 10,
          id: 'floor',
          restitution: 0,
          animation: 'platform'
        },
        { // p6
          spawnX: 750,
          spawnY: -30,
          width: 300,
          height: 10,
          id: 'floor',
          restitution: 0,
          animation: 'platform'
        },
        /*{ // p7
          spawnX: 1000,
          spawnY: 300,
          width: 10,
          height: 200,
          id: 'floor',
          restitution: 0,
          animation: 'platform'
        },*/
        { // p7
          spawnX: 1120,
          spawnY: 500,
          width: 120,
          height: 10,
          id: 'floor',
          restitution: 0,
          animation: 'platform'
        },
        { // p8
          spawnX: 1150,
          spawnY: 425,
          width: 150,
          height: 10,
          id: 'floor',
          restitution: 0,
          animation: 'platform'
        },
        { // p9
          spawnX: 1300,
          spawnY: 463,
          width: 10,
          height: 48,
          id: 'wall',
          restitution: 0,
          animation: 'platform'
        },
        { // p10
          spawnX: 1265,
          spawnY: 500,
          width: 30,
          height: 10,
          id: 'floor',
          restitution: 0,
          animation: 'platform'
        },
        { // p11
          spawnX: 1850,
          spawnY: 550,
          width: 100,
          height: 50,
          id: 'floor',
          restitution: 0,
          animation: 'platform'
        },
        { // p12
          spawnX: 1950,
          spawnY: 475,
          width: 100,
          height: 50,
          id: 'floor',
          restitution: 0,
          animation: 'platform'
        },

        { // p13
          spawnX: 2050,
          spawnY: 400,
          width: 100,
          height: 50,
          id: 'floor',
          restitution: 0,
          animation: 'platform'
        },
        { // p14
          spawnX: 2110,
          spawnY: 550,
          width: 100,
          height: 50,
          id: 'floor',
          restitution: 0,
          animation: 'platform'
        },
        { // p15
          spawnX: 2080,
          spawnY: 475,
          width: 100,
          height: 50,
          id: 'floor',
          restitution: 0,
          animation: 'platform'
        },
        { // p16
          spawnX: 2000,
          spawnY: 550,
          width: 60,
          height: 50,
          id: 'floor',
          restitution: 0,
          animation: 'platform'
        }
      ],
      stars: [
        // star group one
        {
          spawnX: 255,
          spawnY: 20,
          id: 'star',
          animation: 'star',
          width: 10,
          height: 10,
          restitution: 1
        },
        {
          spawnX: 330,
          spawnY: 20,
          id: 'star',
          animation: 'star',
          width: 10,
          height: 10,
          restitution: 1
        },
        {
          spawnX: 400,
          spawnY: 20,
          id: 'star',
          animation: 'star',
          width: 10,
          height: 10,
          restitution: 1
        },
        // hidden star group
        {
          spawnX: 500,
          spawnY: -50,
          id: 'star',
          animation: 'star',
          width: 10,
          height: 10,
          restitution: 0
        },
        {
          spawnX: 550,
          spawnY: -50,
          id: 'star',
          animation: 'star',
          width: 10,
          height: 10,
          restitution: 0
        },
        {
          spawnX: 600,
          spawnY: -50,
          id: 'star',
          animation: 'star',
          width: 10,
          height: 10,
          restitution: 0
        },
        {
          spawnX: 650,
          spawnY: -50,
          id: 'star',
          animation: 'star',
          width: 10,
          height: 10,
          restitution: 0
        },
        {
          spawnX: 700,
          spawnY: -50,
          id: 'star',
          animation: 'star',
          width: 10,
          height: 10,
          restitution: 0
        },
        {
          spawnX: 750,
          spawnY: -50,
          id: 'star',
          animation: 'star',
          width: 10,
          height: 10,
          restitution: 0
        },
        {
          spawnX: 800,
          spawnY: -50,
          id: 'star',
          animation: 'star',
          width: 10,
          height: 10,
          restitution: 0
        },
        {
          spawnX: 850,
          spawnY: -50,
          id: 'star',
          animation: 'star',
          width: 10,
          height: 10,
          restitution: 0
        },
        {
          spawnX: 900,
          spawnY: -50,
          id: 'star',
          animation: 'star',
          width: 10,
          height: 10,
          restitution: 0
        },
        {
          spawnX: 950,
          spawnY: -50,
          id: 'star',
          animation: 'star',
          width: 10,
          height: 10,
          restitution: 0
        },
        {
          spawnX: 1000,
          spawnY: -50,
          id: 'star',
          animation: 'star',
          width: 10,
          height: 10,
          restitution: 0
        },
        {
          spawnX: 1050,
          spawnY: -50,
          id: 'star',
          animation: 'star',
          width: 10,
          height: 10,
          restitution: 0
        }
      ]
    }
  };
