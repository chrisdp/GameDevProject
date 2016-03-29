var worldData = {
    levelOne: {
      players: [
        {
          spawnX: 80,
          spawnY: 360,
          animation: 'dudeIdile',
          id: 'player',
          width: 14,
          height: 23,
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
        }
      ],
      platforms: [
        {
          spawnX: 400,
          spawnY: 300,
          width: 200,
          height: 10,
          id: 'floor',
          restitution: 0,
          animation: 'platform'
        },
        {
          spawnX: 200,
          spawnY: 488,
          width: 500,
          height: 10,
          id: 'floor',
          restitution: 0,
          animation: 'platform'
        },
        {
          spawnX: 1790,
          spawnY: 590,
          width: 1800,
          height: 10,
          id: 'floor',
          restitution: 0,
          animation: 'platform'
        },
        {
          spawnX: 100,
          spawnY: 400,
          width: 150,
          height: 10,
          id: 'floor',
          restitution: 0,
          animation: 'platform'
        },
        {
          spawnX: 850,
          spawnY: 200,
          width: 100,
          height: 10,
          id: 'floor',
          restitution: 0,
          animation: 'platform'
        },
        {
          spawnX: 330,
          spawnY: 100,
          width: 100,
          height: 10,
          id: 'floor',
          restitution: 0,
          animation: 'platform'
        },
        {
          spawnX: 750,
          spawnY: -30,
          width: 300,
          height: 10,
          id: 'floor',
          restitution: 0,
          animation: 'platform'
        },
        {
          spawnX: 1000,
          spawnY: 300,
          width: 10,
          height: 200,
          id: 'floor',
          restitution: 0,
          animation: 'platform'
        }

      ],
      stars: [
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
        }
      ]
    }
  };
