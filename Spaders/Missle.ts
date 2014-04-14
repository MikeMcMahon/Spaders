module Spaders {
    export class Missle extends Phaser.Sprite {
        curTracking: Phaser.Sprite;

        constructor(game: Phaser.Game) {
            super(game, 0, 0, 'missle_shot', 0);
            this.alive = false;
            this.exists = false;

            this.game.physics.enable(this, Phaser.Physics.ARCADE);

            this.anchor.setTo(0.5, 0.5);
            //(<Phaser.Physics.Arcade.Body>this.body).setSize(1, 1, 0, 0);
            (<Phaser.Physics.Arcade.Body>this.body).allowRotation = false;
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
            this.rotation = 0;

            var children = this.game.world.children;
            var found = false;
            for (var i = 0; i < children.length; i++) {
                if (children[i] instanceof Phaser.Sprite) {
                    if ((<Phaser.Sprite> children[i]).name === "e1") {
                        found = true;
                        this.rotation = this.game.physics.arcade.accelerateToObject(this, children[i], 300, 800, 800);
                        this.curTracking = <Phaser.Sprite>children[i];
                        break;
                    }
                }
            }

            if (!found) {
                this.game.physics.arcade.moveToXY(this, this.x + (this.width / 2) - 13, 0, 400);
            }
        }
    }
} 