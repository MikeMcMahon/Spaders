module Spaders
{
    export class Player extends Phaser.Sprite
    {
        lThrust: Phaser.Particles.Arcade.Emitter;
        rThrust: Phaser.Particles.Arcade.Emitter;
        bullets: Phaser.Group;
        missles: Phaser.Group;

        fireRate = 90;
        nextFire = 0;

        missleRate = 550;
        nextMissle = 0;

        constructor(game: Phaser.Game, x: number, y: number) {
            super(game, x, y, 'ship', 0);

            game.physics.enable(this, Phaser.Physics.ARCADE);
            game.add.existing(this);

            this.configure_thrusters();
            this.anchor.setTo(0.5, 0.5);

            this.bullets = game.add.group(this, 'gun');
            this.bullets.enableBody = true;
            this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
            this.bullets.createMultiple(50, 'player_shot_1');
            this.bullets.setAll('checkWorldBounds', true);
            this.bullets.setAll('outOfBoundsKill', true);

            this.missles = game.add.group(this, 'missles');
            this.missles.enableBody = true;
            this.missles.physicsBodyType = Phaser.Physics.ARCADE;
            for (var i = 0; i < 10; i++) {
                this.missles.add(new Missle(game, 0, 0, 'missle_shot'));
                this.missles.getAt(i).alive = false;
                this.missles.getAt(i).exists = false;
            }

            this.missles.setAll('checkWorldBounds', true);
            this.missles.setAll('outOfBoundsKill', true);

            this.game.add.existing(this.bullets);
            this.game.add.existing(this.missles);
        }

        configure_thrusters() : void {
            this.lThrust = new Phaser.Particles.Arcade.Emitter(this.game, 2, this.height);
            this.lThrust.width = 4;
            this.lThrust.makeParticles('p_ship_thrust', [0, 1, 2, 3], 50);
            this.lThrust.minParticleScale = .7;
            this.lThrust.maxParticleScale = 1;
            this.lThrust.setXSpeed(-2, 2);
            this.lThrust.setYSpeed(45, 50);
            this.lThrust.start(false, 500, 150);
            this.lThrust.gravity = 1000;

            this.rThrust = new Phaser.Particles.Arcade.Emitter(this.game, 2, this.height);
            this.rThrust.width = 4;
            this.rThrust.makeParticles('p_ship_thrust', [0, 1, 2, 3], 50);
            this.rThrust.minParticleScale = .7;
            this.rThrust.maxParticleScale = 1;
            this.rThrust.setXSpeed(-2, 2);
            this.rThrust.setYSpeed(45, 50);
            this.rThrust.start(false, 500, 150);
            this.rThrust.gravity = 1000;
        }

        update()
        {
            this.lThrust.x = this.x + 4;
            this.lThrust.y = this.y + this.height;
            this.rThrust.x = this.x + 30;
            this.rThrust.y = this.y + this.height;

            this.game.physics.arcade.moveToPointer(this, 60, this.game.input.activePointer, 500);

            if (this.game.input.activePointer.isDown) {
                this.fire();
            }
        }

        fire() : void
        {
            if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0) {
                this.nextFire = this.game.time.now + this.fireRate;
                var bullet = <Phaser.Sprite>this.bullets.getFirstDead();

                var x = this.x - (bullet.width / 2);

                bullet.reset(x, this.y - (this.height / 2) - bullet.height - 1);

                this.game.physics.arcade.moveToXY(bullet, x, 0, 650);
            }

            if (this.game.time.now > this.nextMissle && this.missles.countDead() > 0) {
                this.nextMissle = this.game.time.now + this.missleRate;
                var missle = <Missle>this.missles.getFirstDead();
                missle.reset(this.x + (this.width / 2) - 20, this.y - 8);
                missle.fire();
            }
        }
    }
}