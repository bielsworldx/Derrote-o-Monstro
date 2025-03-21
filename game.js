const config = {
    type: Phaser.AUTO,
    width: 1500,
    height: 680,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y:0},
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};
const game = new Phaser.Game(config);
let player;
let enemy;
let cursors;

function preload() {
    this.load.spritesheet("player", "playeridle.png", {
        frameWidth: 400,
        frameHeight: 400,
    })
    this.load.spritesheet("enemy", "newenemy.png", {
        frameWidth: 160,
        frameHeight: 128,
    })

}
function create() {
    this.anims.create({
        key:"playerAnim",
        frames:this.anims.generateFrameNumbers("player", {start:0,end:3}),
        frameRate: 5,
        repeat:-1,
    }); 
    player = this.add.sprite(400,300, "player").play("playerAnim");
    player.setScale(0.4);
    this.anims.create({
        key:"enemyAnim",
        frames:this.anims.generateFrameNumbers("enemy", {start:0, end:18}),
        frameRate:9,
        repeat:-1,
    });
    enemy = this.add.sprite(700, 300, "enemy").play("enemyAnim");
    
    cursors=this.input.keyboard.createCursorsKeys();
    
}
function update() {
    if(cursors.left.isDown) {
        player.x-=3;
    }
    else if(cursors.right.isDown) {
        player.x+=3;
    }
    else if (cursors.up.isDown) {
        player.y-=3;
    }
    else if (cursors.down.isDown) {
        player.y+=3;
    }
}