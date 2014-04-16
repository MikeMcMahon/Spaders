///<reference path='Projectile.ts'/>
module Spaders {
    export class Missle extends Projectile {
        curTracking: Enemy;
        curPlayer: Player;

        constructor(game: Phaser.Game, player: Player) {
            super(0, game, 'missle_1', 0, 0);
            this.alive = false;
            this.exists = false;

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

        fire(): void {
            var children = this.game.world.children;
            var found = false;
            for (var i = 0; i < children.length; i++) {
                if (children[i] instanceof Phaser.Group) {
                    if ((<Phaser.Group>children[i]).name === "enemies") {
                        var enemies = (<Phaser.Group>children[i]).children;

                        // Get the closest enemy and SHOOT THEIR FACE OFF
                        var enemy;
                        var maxDistance = 99999;
                        for (var c = 0; c < enemies.length; c++) {
                            if ((<Enemy>enemies[c]).alive) {
                                var d = this.game.physics.arcade.distanceBetween(this, (<Enemy>enemies[c]));
                                if (d <= maxDistance) {
                                    maxDistance = d;
                                    enemy = enemies[c];
                                }
                            }
                        }

                        if (enemy === null)
                            break;

                        found = true;
                        this.rotation = this.game.physics.arcade.moveToObject(this, enemy, 300); //, 800, 800);
                        this.curTracking = enemy;
                        break;
                    }
                }
            }

            if (!found) {
                this.game.physics.arcade.moveToXY(this, this.x + (this.width / 2) - 13, 0, 400);
                this.angle = -90;
            }
        }
    }
} 