﻿module Spaders
{
    export class MainMenu extends Phaser.State
    {
        background: Phaser.Sprite;
        //logo: Phaser.Sprite;

        create()
        {
            this.background = this.add.sprite(this.world.centerX, this.world.centerY, 'titlepage');
            this.background.anchor.setTo(0.5, 0.5);
            this.background.alpha = 0;

            this.add.tween(this.background).to({ alpha: 1 }, 2000, Phaser.Easing.Bounce.InOut, true);

            this.input.onDown.addOnce(this.fadeOut, this);
        }

        fadeOut()
        {
            var tween = this.add.tween(this.background).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);

            tween.onComplete.add(this.startGame, this);
        }

        startGame()
        {
            this.game.state.start('Level1', true, false);
        }
    }
} 