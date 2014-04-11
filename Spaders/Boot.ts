module Spaders
{
    export class Boot extends Phaser.State
    {
        // Load our assets...
        preload()
        {
            this.load.image('loadingBar', 'assets/loading-bar.png');
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