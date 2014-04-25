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

            this.game.scale.minHeight = 480;
            this.game.scale.minWidth = 270;
            this.game.scale.maxWidth = this.game.world.width;
            this.game.scale.maxHeight = this.game.world.height;
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.setScreenSize(true);

            if (this.game.device.desktop) {
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
    var Enemy = (function (_super) {
        __extends(Enemy, _super);
        function Enemy(id, game, x, y, map, inactive) {
            this.behaviorMap = map;
            _super.call(this, game, x, y, map["key"]);

            this.name = map["name"] + id;
            this.maxHealth = map["health"];
            this.health = this.maxHealth;

            this.alive = false;
            this.anchor.setTo(0.5, 0.5);
            this.angle = 90;
            this.events.onRevived.add(this.restore, this);

            this.keyFrames = null;
            this.isTweening = false;

            if (inactive) {
                // inactive.add(this);
            }
        }
        Enemy.prototype.damage = function (amount) {
            var tween = this.game.add.tween(this);
            tween.to({ tint: 0xff0000 }, 100, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(function () {
                var tween = this.game.add.tween(this);
                tween.to({ tint: 0xFFFFFF }, 100, Phaser.Easing.Linear.None, true);
            }, this);

            return _super.prototype.damage.call(this, amount);
        };

        Enemy.prototype.restore = function () {
            this.health = this.maxHealth;
        };

        // TODO - if this badboy is way off screen and won't be coming back (keyframes)
        // KILL IT :)
        Enemy.prototype.update = function () {
            if (this.keyFrames != null) {
                var keyFrame = this.keyFrames.slice(0, 1)[0];
                if (!this.isTweening) {
                    this.isTweening = true;
                    this.game.add.tween(this).to({ x: keyFrame.x, y: keyFrame.y }, 400, Phaser.Easing.Linear.None, true, 0, 0);
                }

                if (+Math.round(this.x).toFixed(0) == keyFrame.x && +Math.round(this.y).toFixed(0) == keyFrame.y) {
                    if (this.keyFrames.length > 1) {
                        this.keyFrames.splice(0, 1);
                        this.isTweening = false;
                    } else {
                        this.keyFrames = null;
                    }
                }
            }
        };
        return Enemy;
    })(Phaser.Sprite);
    Spaders.Enemy = Enemy;
})(Spaders || (Spaders = {}));
var Spaders;
(function (Spaders) {
    var Projectile = (function (_super) {
        __extends(Projectile, _super);
        function Projectile(id, game, key, x, y) {
            this.typeInfo = game.cache.getJSON('projectiles')[key];
            _super.call(this, game, x, y, this.typeInfo["key"]);

            this.firePower = this.typeInfo["damage"];
            this.fireRate = this.typeInfo["fire_rate"];
        }
        Projectile.prototype.fire = function () {
            throw new Error('this is up to the implementor to call');
        };

        Projectile.prototype.doDamage = function (enemy) {
            enemy.damage(this.firePower);
            this.kill();
        };

        /**
        * Certain weapons have upgrades / downgrades
        */
        Projectile.prototype.upgrade = function () {
        };

        Projectile.prototype.downgrade = function () {
        };
        return Projectile;
    })(Phaser.Sprite);
    Spaders.Projectile = Projectile;
})(Spaders || (Spaders = {}));
///<reference path='Projectile.ts'/>
var Spaders;
(function (Spaders) {
    var EnergyBullet = (function (_super) {
        __extends(EnergyBullet, _super);
        function EnergyBullet(game) {
            _super.call(this, 0, game, "shot_1", 0, 0);
            this.alive = false;
            this.exists = false;

            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.allowRotation = false;
            this.anchor.setTo(0.5, 0.5);
        }
        EnergyBullet.prototype.fire = function () {
            this.game.physics.arcade.moveToXY(this, this.x, -100, 850);
        };
        return EnergyBullet;
    })(Spaders.Projectile);
    Spaders.EnergyBullet = EnergyBullet;
})(Spaders || (Spaders = {}));
var Spaders;
(function (Spaders) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, 540, 960, Phaser.CANVAS, 'content', null);

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
            this.debug = false;

            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            this.inactiveEnemies = this.game.add.group();
            this.inactiveEnemies.alive = false;
            this.inactiveEnemies.enableBody = true;
            this.inactiveEnemies.physicsBodyType = Phaser.Physics.ARCADE;

            this.enemies = this.game.add.group(null, "enemies", true, true, Phaser.Physics.ARCADE);
            this.enemies.enableBody = true;
            this.enemies.physicsBodyType = Phaser.Physics.ARCADE;

            var enemyMap = this.cache.getJSON('enemy_map');

            // TODO - this should really happen in a loading screen to prep the level!
            // Prevents us from instantiating too much during runtime
            var script = this.cache.getJSON('level1');
            var waves = script["waves"] || null;
            this.levelWaves = new Array();
            if (waves !== null) {
                for (var w in waves) {
                    var groups = waves[w]["groups"];
                    for (var grp in groups) {
                        var key = groups[grp]["key"];
                        var t = groups[grp]["total"];
                        for (var i = 0; i < t; i++) {
                            this.inactiveEnemies.add(new Spaders.Enemy(i, this.game, -100, -100, enemyMap[key], this.inactiveEnemies));
                        }
                    }
                }
            }

            this.enemies.enableBodyDebug = true;
            this.player = new Spaders.Player(this.game, 60, 60, this.enemies);
            this.player.missles.enableBodyDebug = true;

            this.game.add.existing(this.enemies);

            this.executeLevelScript(script);
        };

        Level1.prototype.executeLevelScript = function (script) {
            var wave1 = script["waves"][0];
            this.game.time.events.add(Phaser.Timer.SECOND * wave1["startTime"], this.generateWave, this, wave1);
        };

        Level1.prototype.generateWave = function (waveDetails) {
            var groups = waveDetails["groups"];

            var enemies = new Array();

            for (var g in groups) {
                var t = groups[g]["total"];
                for (var i = 0; i < t; i++) {
                    //this.enemies.add(this.inactiveEnemies.getAt(i));
                    var e = this.inactiveEnemies.getAt(i);
                    this.inactiveEnemies.remove(e);
                    enemies.push(e);
                }
                var w = new Spaders.Wave(this.game, enemies, this.enemies, groups[g]);
                this.levelWaves.push(w);
            }
        };

        Level1.prototype.update = function () {
            this.game.physics.arcade.overlap(this.enemies, this.player.missles, this.playerShot);
            this.game.physics.arcade.overlap(this.enemies, this.player.bullets, this.playerShot);

            for (var w in this.levelWaves) {
                this.levelWaves[w].update();
            }
        };

        Level1.prototype.playerShot = function (e, p) {
            p.doDamage(e);
        };

        Level1.prototype.render = function () {
            if (this.debug == true) {
                this.game.debug.spriteInfo(this.player, 10, 30);
                this.game.debug.pointer(this.input.activePointer);
                this.game.debug.quadTree(this.game.physics.arcade.quadTree);

                this.game.debug.text("Total Enemies: " + this.enemies.total, 10, 100);
                this.game.debug.text("Total Inactive: " + this.inactiveEnemies.total, 10, 120);
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
///<reference path='Projectile.ts'/>
var Spaders;
(function (Spaders) {
    var Missle = (function (_super) {
        __extends(Missle, _super);
        function Missle(game, player, enemies) {
            _super.call(this, 0, game, 'missle_1', 0, 0);
            this.alive = false;
            this.exists = false;
            this.enemies = enemies;

            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.curTracking = null;
            this.anchor.setTo(0.5, 0.5);
            this.body.allowRotation = false;
            this.curPlayer = player;
        }
        // TODO - we need to break out tracking a new enemy and just firing ze missle
        Missle.prototype.update = function () {
            if (this.curTracking !== null) {
                if (!this.curTracking.alive) {
                    //(<Phaser.Physics.Arcade.Body>this.body).acceleration.setTo(-300, -300);
                    this.fire();
                } else {
                    this.rotation = this.game.physics.arcade.moveToObject(this, this.curTracking, 300); //, 800, 800);
                }
            }
        };

        Missle.prototype.doDamage = function (enemy) {
            var explosion = this.curPlayer.missleExplosions.getFirstDead();
            explosion.reset(this.x, this.y);
            var anim = explosion.animations.getAnimation('boom');
            anim.play(10, false, true);
            _super.prototype.doDamage.call(this, enemy);
        };

        Missle.prototype.findEnemy = function () {
            var p = new Phaser.Point();

            var children = this.game.world.children;
            var found = null;

            var maxDistance = null;
            this.enemies.forEachAlive(function (obj, idx) {
                var d = this.game.physics.arcade.distanceBetween(this, obj);
                if (maxDistance == null) {
                    maxDistance = d;
                }

                if (d <= maxDistance) {
                    found = obj;
                }
            }, this);

            if (found === null) {
                p.x = this.x + (this.width / 2) - 13;
                p.y = -100;
            } else {
                this.curTracking = found;
                p.x = found.x;
                p.y = found.y;
            }

            return p;
        };

        Missle.prototype.fire = function () {
            var p = this.findEnemy();

            this.rotation = this.game.physics.arcade.moveToXY(this, p.x, p.y, 500);
        };
        return Missle;
    })(Spaders.Projectile);
    Spaders.Missle = Missle;
})(Spaders || (Spaders = {}));
var Spaders;
(function (Spaders) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, x, y, enemies) {
            _super.call(this, game, x, y, 'ship', 0);
            this.fireRate = 90;
            this.nextFire = 0;
            this.missleRate = 550;
            this.nextMissle = 0;

            game.physics.enable(this, Phaser.Physics.ARCADE);
            game.add.existing(this);

            //this.configure_thrusters();
            this.anchor.setTo(0.5, 0.5);

            this.bullets = game.add.group(this, 'gun');
            this.bullets.enableBody = true;
            this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
            for (var i = 0; i < 50; i++) {
                this.bullets.add(new Spaders.EnergyBullet(game));
            }
            this.bullets.setAll('checkWorldBounds', true);
            this.bullets.setAll('outOfBoundsKill', true);

            this.missles = game.add.group(this, 'missles');
            this.missles.physicsBodyType = Phaser.Physics.ARCADE;
            this.missles.enableBody = true;
            for (var i = 0; i < 10; i++) {
                this.missles.add(new Spaders.Missle(game, this, enemies));
            }
            this.missles.setAll('checkWorldBounds', true);
            this.missles.setAll('outOfBoundsKill', true);

            this.missleExplosions = game.add.group(this, 'missle_explosions');
            this.missleExplosions.createMultiple(10, 'explosion_1', 0, false);
            this.missleExplosions.alive = false;
            this.missleExplosions.setAll('checkWorldBounds', true);
            this.missleExplosions.setAll('outOfBoundsKill', true);
            this.missleExplosions.forEach(function (obj) {
                obj.anchor.setTo(0.5, 0.5);
                obj.animations.add('boom');
            }, this);

            this.game.add.existing(this.missleExplosions);
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
            //this.lThrust.x = this.x + 4;
            //this.lThrust.y = this.y + this.height;
            //this.rThrust.x = this.x + 30;
            //this.rThrust.y = this.y + this.height;
            this.game.physics.arcade.moveToPointer(this, 60, this.game.input.activePointer, 500);

            if (this.game.input.activePointer.isDown) {
                this.fire();
            }
        };

        Player.prototype.fire = function () {
            if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0) {
                this.nextFire = this.game.time.now + this.fireRate;
                var bullet = this.bullets.getFirstDead();
                bullet.reset(this.x, this.y - (this.height / 2));
                bullet.fire();
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
            this.load.image('flyer', 'assets/enemy_1.png');
            this.load.image('titlepage', 'assets/spaders.png');
            this.load.image('p_star', 'assets/star_particle.jpg');
            this.load.spritesheet('explosion_1', 'assets/explosion_26x26.png', 26, 26);
            this.load.spritesheet('p_ship_thrust', 'assets/ship_trail_particle.png', 2, 2);
            this.load.image('s_energy_1', 'assets/ship_bullet_1.png');
            this.load.image('s_missle_1', 'assets/missle.png');

            // Type Object Maps
            this.load.json('enemy_map', 'maps/enemies.json');
            this.load.json('projectiles', 'maps/projectiles.json');

            // Level Scripts
            this.load.json('level1', 'scripts/level1.json');
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
var Spaders;
(function (Spaders) {
    var Wave = (function () {
        function Wave(game, stagedEnemies, activeEnemies, waveScript) {
            this.game = game;
            this.stagedEnemies = stagedEnemies;
            this.activeEnemies = activeEnemies;
            this.waveStartLoc = new Phaser.Point();
            this.script = waveScript;
            this.initialize();
        }
        Wave.prototype.initialize = function () {
            var points = this.script["points"];
            this.sendEvery = this.script["sendEvery"];
            this.waveStartLoc.setTo(points[0], points[1]);
            this.keyFrames = new Array();
            this.nextSend = this.game.time.now;
            this.activeInternal = new Array();
            points.splice(0, 2);

            for (var i = 0; i < points.length; i += 2) {
                this.keyFrames.push(new Phaser.Point(points[i], points[i + 1]));
            }
        };

        Wave.prototype.update = function () {
            if (this.game.time.now > this.nextSend && this.stagedEnemies.length > 0) {
                this.nextSend = this.game.time.now + this.sendEvery;

                var enemy = this.stagedEnemies.pop();
                this.activate(enemy);
            }
        };

        Wave.prototype.activate = function (e) {
            e.reset(this.waveStartLoc.x, this.waveStartLoc.y);
            e.revive();
            this.activeInternal.push(e);
            this.activeEnemies.add(e);
            e.keyFrames = this.keyFrames.slice(0);
        };
        return Wave;
    })();
    Spaders.Wave = Wave;
})(Spaders || (Spaders = {}));
//# sourceMappingURL=game.js.map
