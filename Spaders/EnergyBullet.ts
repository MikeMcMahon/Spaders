///<reference path='Projectile.ts'/>
module Spaders {
    export class EnergyBullet extends Projectile {
        constructor(game: Phaser.Game) {
            super(0, game, "shot_1", 0, 0);
            this.alive = false;
            this.exists = false;

            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            (<Phaser.Physics.Arcade.Body>this.body).allowRotation = false;
            this.anchor.setTo(0.5, 0.5);
        }


        fire(): void {
            this.game.physics.arcade.moveToXY(this, this.x, -100, 850);
        }
    }
} 