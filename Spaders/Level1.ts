module Spaders
{
    export class Level1 extends Phaser.State
    {
        player: Spaders.Player;

        create()
        {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.player = new Spaders.Player(this.game, 60, 60);
        }


        render()
        {
            this.game.debug.spriteInfo(this.player, 10, 10);
        }   
    }
} 