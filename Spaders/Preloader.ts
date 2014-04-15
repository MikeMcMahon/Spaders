module Spaders {
    export class Preloader extends Phaser.State {
        preloadBar: Phaser.Sprite;

        preload() {
            this.preloadBar = this.add.sprite(0, 0, 'loadingBar', 4);
            this.preloadBar.x = this.game.world.centerX - (this.preloadBar.width / 2);
            this.preloadBar.y = this.game.world.centerY - (this.preloadBar.height / 2);

            this.load.setPreloadSprite(this.preloadBar);
            var loading = this.preloadBar.animations.add('loading');
            loading.play(10, true);

            // load game assets
            this.load.image('ship', 'assets/ship.png');
            this.load.image('enemy_1', 'assets/enemy_1.png');
            this.load.image('titlepage', 'assets/spaders.png');
            this.load.image('p_star', 'assets/star_particle.jpg');
            this.load.spritesheet('explosion_1', 'assets/explosion_26x26.png', 26, 26);
            this.load.spritesheet('p_ship_thrust', 'assets/ship_trail_particle.png', 2, 2);
            this.load.image('s_energy_1', 'assets/ship_bullet_1.png');
            this.load.image('s_missle_1', 'assets/missle.png');
            this.load.json('enemy_map', 'maps/enemies.js');
            this.load.json('projectiles', 'maps/projectiles.js');
        }

        create() {
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);
        }

        startMainMenu() {
            this.game.state.start('MainMenu', true, false);
        }
    }
}