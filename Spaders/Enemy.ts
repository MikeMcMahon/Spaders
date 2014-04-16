module Spaders {
    export class Enemy extends Phaser.Sprite {
        maxHealth: number;

        constructor(id: number, game: Phaser.Game, x: number, y: number, key: string, map: JSON) {
            super(game, x, y, key);
            this.name = map["name"] + id;
            this.maxHealth = map["health"];
            this.health = this.maxHealth;

            this.alive = false;
            this.anchor.setTo(0.5, 0.5);
            this.angle = 90;
            this.events.onRevived.add(this.restore, this);
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

        update() {
            
        }
    }
}