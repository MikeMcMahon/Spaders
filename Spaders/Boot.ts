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

            if (this.game.device.desktop) {
                this.scale.pageAlignHorizontally = true;
                this.scale.pageAlignVertically = true;
            } else {
                // mobile settings
            }

            this.game.state.start('Preloader', true, false);
        }
    }
} 