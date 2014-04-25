module Spaders {
    export class Level1 extends Phaser.State {
        player: Spaders.Player;
        debug: boolean;
        inactiveEnemies: Phaser.Group;
        enemies: Phaser.Group;
        levelWaves: Array<Wave>;

        create() {
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
            var script = <JSON>this.cache.getJSON('level1');
            var waves = script["waves"] || null;
            this.levelWaves = new Array<Wave>();
            if (waves !== null) {
                for (var w in waves) {
                    var groups = waves[w]["groups"];
                    for (var grp in groups) {
                        var key = groups[grp]["key"];
                        var t = groups[grp]["total"];
                        for (var i = 0; i < t; i++) {
                            this.inactiveEnemies.add(
                                new Enemy(
                                    i,
                                    this.game,
                                    -100,
                                    -100,
                                    enemyMap[key],
                                    this.inactiveEnemies
                                    )
                                );
                        }
                    }
                }
            }

            this.enemies.enableBodyDebug = true;
            this.player = new Spaders.Player(this.game, 60, 60, this.enemies);
            this.player.missles.enableBodyDebug = true;

            this.game.add.existing(this.enemies);

            this.executeLevelScript(script);
        }

        currentWave: JSON;
        executeLevelScript(script: JSON) {
            var wave1 = script["waves"][0];
            this.game.time.events.add(Phaser.Timer.SECOND * wave1["startTime"], this.generateWave, this, wave1);
        }

        generateWave(waveDetails: JSON): void {
            var groups = waveDetails["groups"];

            var enemies = new Array<Enemy>();

            for (var g in groups) {
                var t = groups[g]["total"];
                for (var i = 0; i < t; i++) {
                    //this.enemies.add(this.inactiveEnemies.getAt(i));
                    var e = this.inactiveEnemies.getAt(i);
                    this.inactiveEnemies.remove(e);
                    enemies.push(e);
                }
                var w = new Wave(this.game, enemies, this.enemies, groups[g]);
                this.levelWaves.push(w);
            }
        }

        update() {
            this.game.physics.arcade.overlap(this.enemies, this.player.missles, this.playerShot);
            this.game.physics.arcade.overlap(this.enemies, this.player.bullets, this.playerShot);

            for (var w in this.levelWaves) {
                this.levelWaves[w].update();
            }
        }

        
        playerShot(e: Enemy, p: Projectile): void {
            p.doDamage(e);
        }

        render() {
            if (this.debug == true) {
                this.game.debug.spriteInfo(this.player, 10, 30);
                this.game.debug.pointer(this.input.activePointer);
                this.game.debug.quadTree(this.game.physics.arcade.quadTree);

                this.game.debug.text("Total Enemies: " + this.enemies.total, 10, 100);
                this.game.debug.text("Total Inactive: " + this.inactiveEnemies.total, 10, 120);
            }
        }
    }
}