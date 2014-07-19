var BasicGame = {};
BasicGame.Preload = function (game) {
    this.preloadBar = null;
};

BasicGame.Preload.prototype = {
    preload: function () {
        this.preloadBar = this.add.sprite((SCREEN_WIDTH - TILE_SIZE) / 2,
                                          (SCREEN_HEIGHT - TILE_SIZE) / 2,
                                          'platino');
        this.preloadBar.width = TILE_SIZE;
        this.preloadBar.height = TILE_SIZE;
        this.preloadBar.animations.add('bob', [0, 1], 4, true);
        this.preloadBar.animations.play('bob');
        this.load.setPreloadSprite(this.preloadBar);
        
        this.game.load.tilemap('level1', 'scripts/levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'images/Objects/tiles_dark.png');
        this.game.load.image('tiles_before', 'images/Objects/items_before.png');
        this.game.load.image('tiles_after', 'images/Objects/items_after.png');
        this.game.load.image('tiles_bed', 'images/Objects/bed.png');
        this.game.load.image('objects', 'images/Objects/Decor0.png');
        this.game.load.spritesheet('viking', 'images/viking.png', 16, 16);
        
        this.game.load.audio('crickets', 'sounds/crickets.mp3');

        this.game.load.audio('step', 'sounds/step.wav');
        this.game.load.audio('bump', 'sounds/bump.wav');
        this.game.load.audio('hic', 'sounds/hiccup.wav');
        this.game.load.audio('hrrng', 'sounds/hrrng.wav');
        this.game.load.audio('groan', 'sounds/groan.wav');
        this.game.load.audio('break', 'sounds/break.wav');
        this.game.load.audio('pickup', 'sounds/pickup.wav');
        this.game.load.audio('cat', 'sounds/cat.wav');
        this.game.load.audio('glass', 'sounds/glass.wav');
        this.game.load.audio('vomit', 'sounds/vomit.wav');
        this.game.load.audio('smash', 'sounds/smash.wav');
    },

    create: function () {
        //this.preloadBar.cropEnabled = false;

        this.state.start('game');
    }
};
