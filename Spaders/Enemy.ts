module Spaders {
    export class Enemy extends Phaser.Sprite {
        maxHealth: number;
        behaviorMap: JSON;
        keyFrames: Array<Phaser.Point>;
        isTweening: boolean;

        constructor(id: number, game: Phaser.Game, x: number, y: number, map: JSON, inactive?: Phaser.Group) {
            this.behaviorMap = map;
            super(game, x, y, map["key"]);

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

        damage(amount: number) : Phaser.Sprite {
            var tween = this.game.add.tween(this);
            tween.to({ tint: 0xff0000 }, 100, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(function () {
                var tween = this.game.add.tween(this);
                tween.to({ tint: 0xFFFFFF }, 100, Phaser.Easing.Linear.None, true);
            }, this);
            
            return super.damage(amount);
        }

        restore() {
            this.health = this.maxHealth;
        }

        // TODO - if this badboy is way off screen and won't be coming back (keyframes)
        // KILL IT :) 
        update() {
            if (this.keyFrames != null) {
                var keyFrame = this.keyFrames.slice(0, 1)[0];
                if (!this.isTweening) {
                    this.isTweening = true;
                    this.game.add.tween(this).to(
                        { x: keyFrame.x, y: keyFrame.y },
                        400,  // TODO - determine distance and calculate duration based on distance
                        Phaser.Easing.Linear.None, true, 0, 0);
                }

                if (+Math.round(this.x).toFixed(0) == keyFrame.x &&
                    +Math.round(this.y).toFixed(0) == keyFrame.y) {
                    if (this.keyFrames.length > 1) {
                        this.keyFrames.splice(0, 1);
                        this.isTweening = false;
                    } else {
                        this.keyFrames = null;
                    }
                }
            }            
        }
    }
}