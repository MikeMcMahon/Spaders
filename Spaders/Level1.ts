module Spaders
{
    export class Level1 extends Phaser.State
    {
        player: Spaders.Player;
        enemy: Phaser.Sprite;

        create()
        {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.enemy = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'enemy_1');
            this.enemy.name = "e1";
            this.enemy.angle = 90;
            this.enemy.anchor.setTo(0.5, 0.5);
            this.game.physics.enable(this.enemy, Phaser.Physics.ARCADE);
            this.enemy.body.immovable = true;
            this.enemy.body.allowRotation = false;

            this.player = new Spaders.Player(this.game, 60, 60);
        }

        update() {
            this.game.physics.arcade.collide(this.enemy, this.player.missles, this.missleCollides);
            this.game.physics.arcade.collide(this.enemy, this.player.bullets, this.shotCollides);
        }
        missleCollides(obj1, obj2: Missle): void {
            obj2.alive = false;
            obj2.exists = false;
        }
        shotCollides(obj1, obj2: Phaser.Sprite): void {
            obj2.alive = false;
            obj2.exists = false;
        }

        render()
        {
            this.game.debug.spriteInfo(this.enemy, 10, 80);
            this.game.debug.spriteInfo(this.player, 10, 10);
            this.game.debug.quadTree(this.game.physics.arcade.quadTree);
        }   
    }
} 