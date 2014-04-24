module Spaders 
{
    export class Wave {
        game: Phaser.Game;
        stagedEnemies: Array<Enemy>;  // Staged enemies we have yet to send
        activeInternal: Array<Enemy>; // Internally we track the enemies for movement purposes
        activeEnemies: Phaser.Group;  // The enemies group to add them to for easier CD
        script: JSON;

        sendEvery: number;
        nextSend: number;

        waveStartLoc: Phaser.Point;
        waveKeyFrames;

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
            points.splice(0, 2);
            this.waveKeyFrames = points;
        }

        update() {
            if (this.game.time.now > this.nextSend) {
                this.nextSend = this.game.time.now + this.sendEvery;

                var enemy = <Enemy>this.stagedEnemies.pop();

                enemy.reset(this.waveStartLoc.x, this.waveStartLoc.y);
                enemy.revive();
            }
        }
    }
} 