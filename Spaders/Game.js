window.onload = function () {
    var game = new Spaders.Game();
};
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Spaders;
(function (Spaders) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        // Load our assets...
        Boot.prototype.preload = function () {
            this.load.image('loadingBar', 'assets/loading-bar.png');
        };

        Boot.prototype.create = function () {
            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;

            if (this.game.device.desktop) {
                this.scale.pageAlignHorizontally = true;
                this.scale.pageAlignVertically = true;
            } else {
                // mobile settings
            }

            this.game.state.start('Preloader', true, false);
        };
        return Boot;
    })(Phaser.State);
    Spaders.Boot = Boot;
})(Spaders || (Spaders = {}));
var Spaders;
(function (Spaders) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, 640, 700, Phaser.CANVAS, 'content', null);

            this.state.add('Boot', Spaders.Boot, false);
            this.state.add('Preloader', Spaders.Preloader, false);
            this.state.add('MainMenu', Spaders.MainMenu, false);
            this.state.add('Level1', Spaders.Level1, false);

            this.state.start('Boot');
        }
        return Game;
    })(Phaser.Game);
    Spaders.Game = Game;
})(Spaders || (Spaders = {}));
var Spaders;
(function (Spaders) {
    var Level1 = (function (_super) {
        __extends(Level1, _super);
        function Level1() {
            _super.apply(this, arguments);
        }
        Level1.prototype.create = function () {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.player = new Spaders.Player(this.game, 60, 60);
        };

        Level1.prototype.render = function () {
            this.game.debug.spriteInfo(this.player, 10, 10);
        };
        return Level1;
    })(Phaser.State);
    Spaders.Level1 = Level1;
})(Spaders || (Spaders = {}));
var Spaders;
(function (Spaders) {
    var MainMenu = (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            _super.apply(this, arguments);
        }
        //logo: Phaser.Sprite;
        MainMenu.prototype.create = function () {
            this.background = this.add.sprite(0, 0, 'titlepage');
            this.background.alpha = 0;

            this.add.tween(this.background).to({ alpha: 1 }, 2000, Phaser.Easing.Bounce.InOut, true);

            this.input.onDown.addOnce(this.fadeOut, this);
        };

        MainMenu.prototype.fadeOut = function () {
            var tween = this.add.tween(this.background).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);

            tween.onComplete.add(this.startGame, this);
        };

        MainMenu.prototype.startGame = function () {
            this.game.state.start('Level1', true, false);
        };
        return MainMenu;
    })(Phaser.State);
    Spaders.MainMenu = MainMenu;
})(Spaders || (Spaders = {}));
var Spaders;
(function (Spaders) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, x, y) {
            _super.call(this, game, x, y, 'ship', 0);
            this.fireRate = 90;
            this.nextFire = 0;
            this.missleRate = 500;
            this.nextMissle = 0;

            game.physics.enable(this, Phaser.Physics.ARCADE);
            game.add.existing(this);

            this.configure_thrusters();

            this.bullets = new Phaser.Group(this.game, this, 'gun');
            this.bullets.enableBody = true;
            this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
            this.bullets.createMultiple(50, 'player_shot_1');
            this.bullets.setAll('checkWorldBounds', true);
            this.bullets.setAll('outOfBoundsKill', true);

            this.missles = new Phaser.Group(this.game, this, 'missles');
            this.missles.enableBody = true;
            this.missles.physicsBodyType = Phaser.Physics.ARCADE;
            this.missles.createMultiple(10, 'missle_shot');
            this.missles.setAll('checkWorldBounds', true);
            this.missles.setAll('outOfBoundsKill', true);

            game.add.existing(this.missles);
            game.add.existing(this.bullets);
        }
        Player.prototype.configure_thrusters = function () {
            this.lThrust = new Phaser.Particles.Arcade.Emitter(this.game, 2, this.height);
            this.lThrust.width = 4;
            this.lThrust.makeParticles('p_ship_thrust', [0, 1, 2, 3], 50);
            this.lThrust.minParticleScale = .7;
            this.lThrust.maxParticleScale = 1;
            this.lThrust.setXSpeed(-2, 2);
            this.lThrust.setYSpeed(45, 50);
            this.lThrust.start(false, 500, 150);
            this.lThrust.gravity = 1000;

            this.rThrust = new Phaser.Particles.Arcade.Emitter(this.game, 2, this.height);
            this.rThrust.width = 4;
            this.rThrust.makeParticles('p_ship_thrust', [0, 1, 2, 3], 50);
            this.rThrust.minParticleScale = .7;
            this.rThrust.maxParticleScale = 1;
            this.rThrust.setXSpeed(-2, 2);
            this.rThrust.setYSpeed(45, 50);
            this.rThrust.start(false, 500, 150);
            this.rThrust.gravity = 1000;
        };

        Player.prototype.update = function () {
            this.lThrust.x = this.x + 4;
            this.lThrust.y = this.y + this.height;
            this.rThrust.x = this.x + 30;
            this.rThrust.y = this.y + this.height;

            this.game.physics.arcade.moveToPointer(this, 60, this.game.input.activePointer, 500);

            if (this.game.input.activePointer.isDown) {
                this.fire();
            }
        };

        Player.prototype.fire = function () {
            if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0) {
                this.nextFire = this.game.time.now + this.fireRate;
                var bullet = this.bullets.getFirstDead();

                var x = this.x + (this.width / 2) - (bullet.width / 2);

                bullet.reset(x, this.y - 4);

                this.game.physics.arcade.moveToXY(bullet, x, 0, 550);
            }

            if (this.game.time.now > this.nextMissle && this.missles.countDead() > 0) {
                this.nextMissle = this.game.time.now + this.missleRate;
                var missle = this.missles.getFirstDead();
                missle.reset(this.x + (this.width / 2) - 13, this.y - 4);

                this.game.physics.arcade.moveToXY(missle, this.x + (this.width / 2) - 13, 0, 300);
            }
        };
        return Player;
    })(Phaser.Sprite);
    Spaders.Player = Player;
})(Spaders || (Spaders = {}));
var Spaders;
(function (Spaders) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            _super.apply(this, arguments);
        }
        Preloader.prototype.preload = function () {
            this.preloadBar = this.add.sprite(this.game.world.centerX - (60), this.game.world.centerY - 15, 'loadingBar');
            this.load.setPreloadSprite(this.preloadBar);

            // load game assets
            this.load.image('ship', 'assets/ship.png');
            this.load.image('titlepage', 'assets/spaders.png');
            this.load.image('p_star', 'assets/star_particle.jpg');
            this.load.image('p_ship_thrust', 'assets/ship_trail_particle.png');
            this.load.image('player_shot_1', 'assets/ship_bullet_1.png');
            this.load.image('missle_shot', 'assets/missle.png');
        };

        Preloader.prototype.create = function () {
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);
        };

        Preloader.prototype.startMainMenu = function () {
            this.game.state.start('MainMenu', true, false);
        };
        return Preloader;
    })(Phaser.State);
    Spaders.Preloader = Preloader;
})(Spaders || (Spaders = {}));
//# sourceMappingURL=Game.js.map
