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
            this.enemy.anchor.setTo(0.5, 0.5);
            this.game.physics.enable(this.enemy, Phaser.Physics.ARCADE);
            this.enemy.body.bounce.set(1);
            this.enemy.body.collideWorldBounds = true;

            this.player = new Spaders.Player(this.game, 60, 60);
        }

        update() {
            this.game.physics.arcade.collide(this.enemy, this.player.missles);
            this.enemy.rotation = this.game.physics.arcade.angleBetween(this.enemy, this.player);
        }


        render()
        {
            this.game.debug.spriteInfo(this.enemy, 10, 80);
            this.game.debug.spriteInfo(this.player, 10, 10);
            this.game.debug.quadTree(this.game.physics.arcade.quadTree);
        }   
    }
} 