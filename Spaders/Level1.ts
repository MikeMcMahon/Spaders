module Spaders {
    export class Level1 extends Phaser.State {
        player: Spaders.Player;
        debug: boolean;
        enemies: Phaser.Group;

        create() {
            this.debug = true;

            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            this.enemies = this.game.add.group();
            this.enemies.name = 'enemies';
            this.enemies.enableBody = true;
            this.enemies.physicsBodyType = Phaser.Physics.ARCADE;

            var enemyMap = this.cache.getJSON('enemy_map');

            // TODO - this should really happen in a loading screen to prep the level!
            // Prevents us from instantiating too much during runtime
            var script = this.cache.getJSON('level1');
            var waves = script["waves"] || null;
            if (waves !== null) {
                for (var w in waves) {
                    var groups = waves[w]["groups"];
                    for (var grp in groups) {
                        var key = groups[grp]["key"];
                        var t = groups[grp]["total"];
                        for (var i = 0; i < t; i++) {
                            this.enemies.add(
                                new Enemy(
                                    i,
                                    this.game,
                                    Math.random() * this.game.world.width,
                                    Math.random() * this.game.world.height / 2,
                                    enemyMap[key]['key'],
                                    enemyMap[key]
                                    )
                                );
                        }
                    }

                }
            }
            this.enemies.setAll('alive', true);
            this.enemies.enableBodyDebug = true;
            this.player = new Spaders.Player(this.game, 60, 60);
            this.player.missles.enableBodyDebug = true;
        }


        update() {
            /*var dead = <Enemy>this.enemies.getFirstDead();
            if (dead !== null) {
                dead.reset(
                    Math.random() * this.game.world.width,
                    Math.random() * this.game.world.height
                    );
                dead.revive();
            }*/
            
           this.game.physics.arcade.overlap(this.enemies, this.player.missles, this.playerShot);
           this.game.physics.arcade.overlap(this.enemies, this.player.bullets, this.playerShot);
        }

        
        playerShot(e: Enemy, p: Projectile): void {
            p.doDamage(e);
        }

        render() {
            if (this.debug == true) {
                this.game.debug.spriteInfo(this.player, 10, 30);
                this.game.debug.pointer(this.input.activePointer);
                this.game.debug.quadTree(this.game.physics.arcade.quadTree);
            }
        }
    }
}