module Spaders {
    export class Projectile extends Phaser.Sprite {
        typeInfo: JSON;
        firePower: number;
        fireRate: number;

        constructor(id: number, game: Phaser.Game, key: string, x: number, y: number) {
            this.typeInfo = <JSON>game.cache.getJSON('projectiles')[key];
            super(game, x, y, this.typeInfo["key"]);

            this.firePower = this.typeInfo["damage"];
            this.fireRate = this.typeInfo["fire_rate"];
        }

        fire(): void {
            throw new Error('this is up to the implementor to call');
        }

        doDamage(enemy: Enemy): void {
            enemy.damage(this.firePower);
            this.kill();
        }

        /** 
         * Certain weapons have upgrades / downgrades
         */
        upgrade(): void {
            
        }

        downgrade(): void {

        }
    }
} 