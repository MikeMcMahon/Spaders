module Spaders {
    export class Enemy extends Phaser.Sprite {
        maxHealth: number;

        constructor(id: number, game: Phaser.Game, x: number, y: number, key: string, map: JSON) {
            super(game, x, y, key);
            this.name = map["name"] + id;
            this.maxHealth = map["health"];
            this.health = this.maxHealth;

            this.anchor.setTo(0.5, 0.5);
            this.angle = 90;
            this.events.onRevived.add(this.restore, this);
        }

        restore() {
            this.health = this.maxHealth;
        }

        update() {
            
        }
    }
}