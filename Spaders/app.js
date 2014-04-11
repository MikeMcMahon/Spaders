var Spaders2 = (function () {
    function Spaders2() {
        this.game = new Phaser.Game(320, 320, Phaser.AUTO, 'content', {
            preload: this.preload, create: this.create
        });
    }
    Spaders2.prototype.preload = function () {
        this.game.load.image('logo', 'Spaders.png');
    };

    Spaders2.prototype.create = function () {
        var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        logo.anchor.setTo(0.5, 0.5);
    };
    return Spaders2;
})();

window.onload = function () {
    var game = new Spaders2();
};
//# sourceMappingURL=app.js.map
