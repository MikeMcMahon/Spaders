///<reference path='Projectile.ts'/>
module Spaders {
    export class Missle extends Projectile {
        curTracking: Enemy;
        curPlayer: Player;
        enemies: Phaser.Group; 

        constructor(game: Phaser.Game, player: Player, enemies: Phaser.Group) {
            super(0, game, 'missle_1', 0, 0);
            this.alive = false;
            this.exists = false;
            this.enemies = enemies;

            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.curTracking = null;
            this.anchor.setTo(0.5, 0.5);
            (<Phaser.Physics.Arcade.Body>this.body).allowRotation = false;
            this.curPlayer = player;
        }
        
        // TODO - we need to break out tracking a new enemy and just firing ze missle
        update() {
            if (this.curTracking !== null) {
                if (!this.curTracking.alive) {
                    //(<Phaser.Physics.Arcade.Body>this.body).acceleration.setTo(-300, -300);
                    this.fire();
                } else {
                    this.rotation = this.game.physics.arcade.moveToObject(this, this.curTracking, 300);//, 800, 800);
                }
            }
        }

        doDamage(enemy: Enemy): void {
            var explosion = <Phaser.Sprite>this.curPlayer.missleExplosions.getFirstDead();
            explosion.reset(this.x, this.y);
            var anim = explosion.animations.getAnimation('boom');
            anim.play(10, false, true);
            super.doDamage(enemy);
        }

        findEnemy(): Phaser.Point {
            var p = new Phaser.Point();

            var children = this.game.world.children;
            var found = null;

            var maxDistance = null;
            this.enemies.forEachAlive(function (obj: Enemy, idx) {
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
        }

        fire(): void {
            var p = this.findEnemy();

            this.rotation = this.game.physics.arcade.moveToXY(this, p.x, p.y, 500);
        }
    }
} 