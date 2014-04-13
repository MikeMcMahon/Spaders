module Spaders {
    export class Missle extends Phaser.Sprite {
        curTracking: Phaser.Sprite;

        update() {
        }

        fire(): void {
            this.rotation = 0;

            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.allowRotation = false;
            this.anchor.setTo(0.5, 0.5);

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