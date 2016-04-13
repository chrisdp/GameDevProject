var worldData = {
    levelOne: {
      players: [
        {
          spawnX: 30,
          spawnY: 300,
          animation: 'dudeIdile',
          id: 'player',
          width: 9,
          height: 21,
          hp: 5,
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
          width: 12,
          height: 13
        },
        {
          spawnX: 500,
          spawnY: 500,
          patOne: 100,
          patTwo: 1000,
          id: 'baddy',
          animation: 'moveLeft',
          width: 12,
          height: 13
        },
        {
          spawnX: 1060,
          spawnY: 466,
          patOne: 1005,
          patTwo: 1070,
          id: 'baddy',
          animation: 'moveLeft',
          width: 12,
          height: 13
        },
        // pit baddys
        {
          spawnX: 2300,
          spawnY: 466,
          patOne: 2225,
          patTwo: 2440,
          id: 'baddy',
          animation: 'moveLeft',
          width: 12,
          height: 13
        },
        {
          spawnX: 2500,
          spawnY: 466,
          patOne: 2470,
          patTwo: 2570,
          id: 'baddy',
          animation: 'moveLeft',
          width: 12,
          height: 13
        },
        {
          spawnX: 2640,
          spawnY: 466,
          patOne: 2630,
          patTwo: 2750,
          id: 'baddy',
          animation: 'moveLeft',
          width: 12,
          height: 13
        },
        {
          spawnX: 2600,
          spawnY: 400,
          patOne: 2600,
          patTwo: 2700,
          id: 'baddy',
          animation: 'moveLeft',
          width: 12,
          height: 13
        },
        {
          spawnX: 1200,
          spawnY: 50,
          patOne: 1070,
          patTwo: 1320,
          id: 'baddy',
          animation: 'moveLeft',
          width: 12,
          height: 13
        },
        {
          spawnX: 1550,
          spawnY: 150,
          patOne: 1515,
          patTwo: 1680,
          id: 'baddy',
          animation: 'moveLeft',
          width: 12,
          height: 13
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
        { // p7
          spawnX: 1120,
          spawnY: 501,
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
          id: 'floor',
          restitution: 0,
          animation: 'platform'
        },
        { // p10
          spawnX: 1265,
          spawnY: 501,
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
        },
        { // p17
          spawnX: 2300,
          spawnY: 250,
          width: 60,
          height: 10,
          id: 'floor',
          restitution: 0,
          animation: 'platform'
        },
        { // p18
          spawnX: 2500,
          spawnY: 175,
          width: 10,
          height: 80,
          id: 'floor',
          restitution: 0,
          animation: 'platform'
        },
        { // p19
          spawnX: 2600,
          spawnY: 450,
          width: 150,
          height: 10,
          id: 'floor',
          restitution: 0,
          animation: 'platform'
        },
        { // p20
          spawnX: 1200,
          spawnY: 100,
          width: 150,
          height: 10,
          id: 'floor',
          restitution: 0,
          animation: 'platform'
        },
        { // p21
          spawnX: 1600,
          spawnY: 200,
          width: 150,
          height: 10,
          id: 'floor',
          restitution: 0,
          animation: 'platform'
        }
      ],
      stars: [
        // star group one
        {
          spawnX: 255,
          spawnY: 40,
          id: 'star',
          animation: 'star',
          width: 10,
          height: 10,
          restitution: 1
        },
        {
          spawnX: 330,
          spawnY: 40,
          id: 'star',
          animation: 'star',
          width: 10,
          height: 10,
          restitution: 1
        },
        {
          spawnX: 400,
          spawnY: 40,
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
        },
        {
          spawnX: 55,
          spawnY: 530,
          id: 'star',
          animation: 'star',
          width: 10,
          height: 10,
          restitution: 1
        },
        {
          spawnX: 15,
          spawnY: 530,
          id: 'star',
          animation: 'star',
          width: 10,
          height: 10,
          restitution: 1
        },

        {
          spawnX: 780,
          spawnY: 140,
          id: 'star',
          animation: 'star',
          width: 10,
          height: 10,
          restitution: 1
        },
        {
          spawnX: 850,
          spawnY: 140,
          id: 'star',
          animation: 'star',
          width: 10,
          height: 10,
          restitution: 1
        },
        {
          spawnX: 920,
          spawnY: 140,
          id: 'star',
          animation: 'star',
          width: 10,
          height: 10,
          restitution: 1
        },
        {
          spawnX: 2500,
          spawnY: 10,
          id: 'star',
          animation: 'star',
          width: 10,
          height: 10,
          restitution: 1
        },
        {
          spawnX: 2600,
          spawnY: 500,
          id: 'star',
          animation: 'star',
          width: 10,
          height: 10,
          restitution: 1
        },
        {
          spawnX: 1130,
          spawnY: 460,
          id: 'star',
          animation: 'star',
          width: 10,
          height: 10,
          restitution: 1
        },
        {
          spawnX: 1155,
          spawnY: 462,
          id: 'star',
          animation: 'star',
          width: 10,
          height: 10,
          restitution: 1
        },
        {
          spawnX: 1180,
          spawnY: 464,
          id: 'star',
          animation: 'star',
          width: 10,
          height: 10,
          restitution: 1
        },
        {
          spawnX: 1205,
          spawnY: 462,
          id: 'star',
          animation: 'star',
          width: 10,
          height: 10,
          restitution: 1
        },
        {
          spawnX: 1230,
          spawnY: 460,
          id: 'star',
          animation: 'star',
          width: 10,
          height: 10,
          restitution: 1
        },
        {
          spawnX: 1255,
          spawnY: 462,
          id: 'star',
          animation: 'star',
          width: 10,
          height: 10,
          restitution: 1
        },
        {
          spawnX: 1480,
          spawnY: 140,
          id: 'star',
          animation: 'star',
          width: 10,
          height: 10,
          restitution: 1
        },
        {
          spawnX: 1720,
          spawnY: 140,
          id: 'star',
          animation: 'star',
          width: 10,
          height: 10,
          restitution: 1
        },
      ]
    }
  };
