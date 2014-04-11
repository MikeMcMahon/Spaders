module Spaders
{
    export class Preloader extends Phaser.State
    {
        preloadBar: Phaser.Sprite;

        preload()
        {
            this.preloadBar = this.add.sprite(this.game.world.centerX - (60), this.game.world.centerY-15, 'loadingBar');
            this.load.setPreloadSprite(this.preloadBar);

            // load game assets
            this.load.image('ship', 'assets/ship.png');
            this.load.image('titlepage', 'assets/spaders.png');
            this.load.image('p_star', 'assets/star_particle.jpg');
            this.load.image('p_ship_thrust', 'assets/ship_trail_particle.png');
            this.load.image('player_shot_1', 'assets/ship_bullet_1.png');
            this.load.image('missle_shot', 'assets/missle.png');
        }

        create()
        {
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);
        }

        startMainMenu()
        {
            this.game.state.start('MainMenu', true, false);
        }
    }
} 