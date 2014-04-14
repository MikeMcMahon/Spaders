module Spaders {
    export class Level1 extends Phaser.State {
        player: Spaders.Player;
        debug: boolean;
        enemies: Phaser.Group;

        create() {
            this.debug = false;

            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            this.enemies = this.game.add.group();
            this.enemies.name = 'enemies';
            this.enemies.enableBody = true;
            this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
            var enemyMap = this.cache.getJSON('enemy_map');
            for (var i = 0; i < 10; i++) {
                this.cache.getJSON('enemy_map');
                this.enemies.add(
                    new Enemy(
                        i,
                        this.game,
                        Math.random() * this.game.world.width,
                        Math.random() * this.game.world.height,
                        'enemy_1',
                        enemyMap['flyer']
                        )
                    );
            }
            this.enemies.enableBodyDebug = true;
            this.enemies.setAll('alive', true);
            this.enemies.setAll('body.immovable', true);

            this.player = new Spaders.Player(this.game, 60, 60);
            this.player.missles.enableBodyDebug = true;
        }


        update() {
            var dead = <Enemy>this.enemies.getFirstDead();
            if (dead !== null) {
                dead.reset(
                    Math.random() * this.game.world.width,
                    Math.random() * this.game.world.height
                    );
                dead.revive();
            }
            this.game.physics.arcade.overlap(this.enemies, this.player.missles, this.missleCollides);
            this.game.physics.arcade.overlap(this.enemies, this.player.bullets, this.shotCollides);
        }

        missleCollides(obj1: Enemy, obj2: Missle): void {
            obj2.explode();
            obj1.damage(25);
        }
        shotCollides(obj1: Enemy, obj2: Phaser.Sprite): void {
            obj2.kill();
            obj1.damage(10);
        }

        render() {
            if (this.debug == true) {
                this.game.debug.spriteInfo(this.player, 10, 10);
            }
        }
    }
}