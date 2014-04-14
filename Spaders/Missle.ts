module Spaders {
    export class Missle extends Phaser.Sprite {
        curTracking: Enemy;

        constructor(game: Phaser.Game) {
            super(game, 0, 0, 'missle_shot', 0);
            this.alive = false;
            this.exists = false;

            this.game.physics.enable(this, Phaser.Physics.ARCADE);

            this.anchor.setTo(0.5, 0.5);
            (<Phaser.Physics.Arcade.Body>this.body).allowRotation = false;
        }

        update() {
        }

        explode(): void {
            // create an explosion in the current location
            var explosion = this.game.add.sprite(this.x, this.y, 'explosion_1');
            explosion.anchor.setTo(0.5, 0.5);
            var anim = explosion.animations.add('boom');
            anim.play(10, false, true);
            this.alive = false;
            this.exists = false;
        }

        fire(): void {

            var children = this.game.world.children;
            var found = false;
            for (var i = 0; i < children.length; i++) {
                if (children[i] instanceof Phaser.Group) {
                    if ((<Phaser.Group>children[i]).name === "enemies") {
                        var first = (<Phaser.Group>children[i]).getFirstAlive();

                        if (first === null)
                            break;

                        found = true;
                        this.rotation = this.game.physics.arcade.accelerateToObject(this, first, 300, 800, 800);
                        this.curTracking = first;
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