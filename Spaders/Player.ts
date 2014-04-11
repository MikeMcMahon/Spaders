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

        missleRate = 500;
        nextMissle = 0;

        constructor(game: Phaser.Game, x: number, y: number)
        {
            super(game, x, y, 'ship', 0);

            game.physics.enable(this, Phaser.Physics.ARCADE);
            game.add.existing(this);

            this.lThrust = new Phaser.Particles.Arcade.Emitter(game, 2, this.height);
            this.lThrust.width = 4;
            this.lThrust.makeParticles('p_ship_thrust', [0, 1, 2, 3], 50);
            this.lThrust.minParticleScale = .7;
            this.lThrust.maxParticleScale = 1;
            this.lThrust.setXSpeed(-5, 5);
            this.lThrust.setYSpeed(45, 50);
            this.lThrust.start(false, 500, 150);

            this.rThrust = new Phaser.Particles.Arcade.Emitter(game, 2, this.height);
            this.rThrust.width = 4;
            this.rThrust.makeParticles('p_ship_thrust', [0, 1, 2, 3], 50);
            this.rThrust.minParticleScale = .7;
            this.rThrust.maxParticleScale = 1;
            this.rThrust.setXSpeed(-5, 5);
            this.rThrust.setYSpeed(45, 50);
            this.rThrust.start(false, 500, 150);

            this.bullets = new Phaser.Group(this.game, this, 'gun');
            this.bullets.enableBody = true;
            this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
            this.bullets.createMultiple(50, 'player_shot_1');
            this.bullets.setAll('checkWorldBounds', true);
            this.bullets.setAll('outOfBoundsKill', true);

            this.missles = new Phaser.Group(this.game, this, 'missles');
            this.missles.enableBody = true;
            this.missles.physicsBodyType = Phaser.Physics.ARCADE;
            this.missles.createMultiple(10, 'missle_shot');
            this.missles.setAll('checkWorldBounds', true);
            this.missles.setAll('outOfBoundsKill', true);

            game.add.existing(this.missles);
            game.add.existing(this.bullets);            
        }

        update()
        {
            this.lThrust.x = this.x + 3;
            this.lThrust.y = this.y + this.height;
            this.rThrust.x = this.x + 14;
            this.rThrust.y = this.y + this.height;

            this.game.physics.arcade.moveToPointer(this, 60, this.game.input.activePointer, 500);

            if (this.game.input.activePointer.isDown) {
                this.fire();
            }
        }

        fire()
        {
            if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0) {
                this.nextFire = this.game.time.now + this.fireRate;
                var bullet = this.bullets.getFirstDead();
                bullet.reset(this.x + (this.width / 2) - 3, this.y - 4);

                this.game.physics.arcade.moveToXY(bullet, this.x + (this.width / 2), 0, 450);
            }

            if (this.game.time.now > this.nextMissle && this.missles.countDead() > 0) {
                this.nextMissle = this.game.time.now + this.missleRate;
                var missle = this.missles.getFirstDead();
                missle.reset(this.x + (this.width / 2) - 13, this.y - 4);

                this.game.physics.arcade.moveToXY(missle, this.x + (this.width / 2) - 13, 0, 300);
            }
        }
    }
}