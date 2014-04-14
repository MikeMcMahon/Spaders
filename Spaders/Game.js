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
            this.load.spritesheet('loadingBar', 'assets/loading-bar.png', 360, 90, 4);
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
            _super.call(this, 640, 640, Phaser.CANVAS, 'content', null);

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
            this.debug = true;

            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.enemy = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'enemy_1');
            this.enemy.name = "e1";
            this.enemy.angle = 90;
            this.enemy.anchor.setTo(0.5, 0.5);
            this.game.physics.enable(this.enemy, Phaser.Physics.ARCADE);

            this.enemy.body.immovable = true;
            this.enemy.body.allowRotation = false;

            this.player = new Spaders.Player(this.game, 60, 60);
            this.player.missles.enableBodyDebug = true;
        };

        Level1.prototype.update = function () {
            this.game.physics.arcade.collide(this.enemy, this.player.missles, this.missleCollides);
            this.game.physics.arcade.collide(this.enemy, this.player.bullets, this.shotCollides);
        };
        Level1.prototype.missleCollides = function (obj1, obj2) {
            obj2.explode();
        };
        Level1.prototype.shotCollides = function (obj1, obj2) {
            obj2.alive = false;
            obj2.exists = false;
        };

        Level1.prototype.render = function () {
            if (this.debug == true) {
                if (this.player.missles.getFirstAlive() !== null)
                    this.game.debug.body(this.player.missles.getFirstAlive());

                this.game.debug.body(this.enemy);
                this.game.debug.spriteInfo(this.enemy, 10, 80);
                this.game.debug.spriteInfo(this.player, 10, 10);
            }
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
            this.background = this.add.sprite(this.world.centerX, this.world.centerY, 'titlepage');
            this.background.anchor.setTo(0.5, 0.5);
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
    var Missle = (function (_super) {
        __extends(Missle, _super);
        function Missle(game) {
            _super.call(this, game, 0, 0, 'missle_shot', 0);
            this.alive = false;
            this.exists = false;

            this.game.physics.enable(this, Phaser.Physics.ARCADE);

            this.anchor.setTo(0.5, 0.5);

            //(<Phaser.Physics.Arcade.Body>this.body).setSize(1, 1, 0, 0);
            this.body.allowRotation = false;
        }
        Missle.prototype.explode = function () {
            // create an explosion in the current location
            var explosion = this.game.add.sprite(this.x, this.y, 'explosion_1');
            explosion.anchor.setTo(0.5, 0.5);
            var anim = explosion.animations.add('boom');
            anim.play(10, false, true);
            this.alive = false;
            this.exists = false;
        };

        Missle.prototype.fire = function () {
            this.rotation = 0;

            var children = this.game.world.children;
            var found = false;
            for (var i = 0; i < children.length; i++) {
                if (children[i] instanceof Phaser.Sprite) {
                    if (children[i].name === "e1") {
                        found = true;
                        this.rotation = this.game.physics.arcade.accelerateToObject(this, children[i], 300, 800, 800);
                        this.curTracking = children[i];
                        break;
                    }
                }
            }

            if (!found) {
                this.game.physics.arcade.moveToXY(this, this.x + (this.width / 2) - 13, 0, 400);
            }
        };
        return Missle;
    })(Phaser.Sprite);
    Spaders.Missle = Missle;
})(Spaders || (Spaders = {}));
var Spaders;
(function (Spaders) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, x, y) {
            _super.call(this, game, x, y, 'ship', 0);
            this.fireRate = 90;
            this.nextFire = 0;
            this.missleRate = 550;
            this.nextMissle = 0;

            game.physics.enable(this, Phaser.Physics.ARCADE);
            game.add.existing(this);

            this.configure_thrusters();
            this.anchor.setTo(0.5, 0.5);

            this.bullets = game.add.group(this, 'gun');
            this.bullets.enableBody = true;
            this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
            this.bullets.createMultiple(50, 'player_shot_1');
            this.bullets.setAll('checkWorldBounds', true);
            this.bullets.setAll('outOfBoundsKill', true);

            this.missles = game.add.group(this, 'missles');
            this.missles.physicsBodyType = Phaser.Physics.ARCADE;
            this.missles.enableBody = true;
            for (var i = 0; i < 10; i++) {
                this.missles.add(new Spaders.Missle(game));
            }

            this.missles.setAll('checkWorldBounds', true);
            this.missles.setAll('outOfBoundsKill', true);

            this.game.add.existing(this.bullets);
            this.game.add.existing(this.missles);
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

                var x = this.x - (bullet.width / 2);

                bullet.reset(x, this.y - (this.height / 2) - bullet.height - 1);

                this.game.physics.arcade.moveToXY(bullet, x, 0, 650);
            }

            if (this.game.time.now > this.nextMissle && this.missles.countDead() > 0) {
                this.nextMissle = this.game.time.now + this.missleRate;
                var missle = this.missles.getFirstDead();
                missle.reset(this.x + (this.width / 2) - 20, this.y - 8);
                missle.fire();
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
            this.preloadBar = this.add.sprite(0, 0, 'loadingBar', 4);
            this.preloadBar.x = this.game.world.centerX - (this.preloadBar.width / 2);
            this.preloadBar.y = this.game.world.centerY - (this.preloadBar.height / 2);

            this.load.setPreloadSprite(this.preloadBar);
            var loading = this.preloadBar.animations.add('loading');
            loading.play(10, true);

            // load game assets
            this.load.image('ship', 'assets/ship.png');
            this.load.image('enemy_1', 'assets/enemy_1.png');
            this.load.image('titlepage', 'assets/spaders.png');
            this.load.image('p_star', 'assets/star_particle.jpg');
            this.load.spritesheet('explosion_1', 'assets/explosion_26x26.png', 26, 26);
            this.load.spritesheet('p_ship_thrust', 'assets/ship_trail_particle.png', 2, 2);
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
//# sourceMappingURL=game.js.map
