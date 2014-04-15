module Spaders
{
    export class Boot extends Phaser.State
    {
        // Load our assets...
        preload()
        {
            this.load.spritesheet('loadingBar', 'assets/loading-bar.png', 360, 90, 4);
        }

        create()
        {
            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;

            this.game.scale.minHeight = 480;
            this.game.scale.minWidth = 270;
            this.game.scale.maxWidth = this.game.world.width;
            this.game.scale.maxHeight = this.game.world.height;
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.setScreenSize(true);

            if (this.game.device.desktop) {
                
            } else {
                // mobile settings
            }

            this.game.state.start('Preloader', true, false);
        }
    }
} 