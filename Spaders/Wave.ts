module Spaders 
{
    export class Wave {
        game: Phaser.Game;
        stagedEnemies: Array<Enemy>;  // Staged enemies we have yet to send
        activeInternal: Array<Enemy>; // Internally we track the enemies for movement purposes
        keyFrames: Array<Phaser.Point>;
        activeEnemies: Phaser.Group;  // The enemies group to add them to for easier CD
        script: JSON;

        sendEvery: number;
        nextSend: number;

        waveStartLoc: Phaser.Point;
        waveFinished: boolean;

        constructor(game: Phaser.Game, stagedEnemies: Array<Enemy>, activeEnemies: Phaser.Group, waveScript: JSON) {
            this.game = game;
            this.stagedEnemies = stagedEnemies;
            this.activeEnemies = activeEnemies;
            this.waveStartLoc = new Phaser.Point();
            this.script = waveScript;
            this.initialize();
        }

        private initialize(): void {
            var points = this.script["points"];
            this.sendEvery = this.script["sendEvery"];
            this.waveStartLoc.setTo(points[0], points[1]);
            this.keyFrames = new Array<Phaser.Point>();
            this.nextSend = this.game.time.now;
            this.activeInternal = new Array<Enemy>();
            points.splice(0, 2);

            for (var i = 0; i < points.length; i += 2) {
                this.keyFrames.push(new Phaser.Point(points[i], points[i + 1]));
            }
        }

        update() {
            if (this.game.time.now > this.nextSend && this.stagedEnemies.length > 0) {
                this.nextSend = this.game.time.now + this.sendEvery;

                var enemy = <Enemy>this.stagedEnemies.pop();
                this.activate(enemy);
            }
        }

        activate(e): void {
            e.reset(this.waveStartLoc.x, this.waveStartLoc.y);
            e.revive();
            this.activeInternal.push(e);
            this.activeEnemies.add(e);
            this.game.physics.arcade.moveToXY(e, this.keyFrames[0].x, this.keyFrames[0].y, 500);
        }
    }
} 