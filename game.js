const config = {
    type: Phaser.AUTO,
    width: 1500,
    height: 680,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y:500},
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
let score = 0;
let scoreText;
let playerCollision = true;
let playerLives = 3;
let livesText;
let enemyLives = 10;
let enemyLivesText;
let victoryText;
let swords;
let playerDirection = "right";

function preload() {
    this.load.spritesheet("player", "playeridle.png", {
        frameWidth: 400,
        frameHeight: 400,
    })
    this.load.spritesheet("playerRight", "playeridleright.png", {
        frameWidth: 400,
        frameHeight: 400,
    })
    this.load.spritesheet("enemy", "newenemy.png", {
        frameWidth: 640,
        frameHeight: 640,
    })
    this.load.spritesheet("enemyR", "newenemyr.png", {
        frameWidth: 640,
        frameHeight: 640,
    })
    this.load.image("swordRight", "sword.png");
    this.load.image("swordLeft", "swordleft.png");
    this.load.image("floor","floor.png");
}
function create() {
    this.cameras.main.setBackgroundColor("#29757C");

    this.anims.create({
        key:"playerAnim",
        frames:this.anims.generateFrameNumbers("player", {start:0,end:3}),
        frameRate: 5,
        repeat:-1,
    }); 
    player = this.physics.add.sprite(400,375, "player").play("playerAnim");
    player.setScale(0.3);
    player.setCollideWorldBounds(true);
    player.body.setGravityY(3000);
    this.anims.create({
        key:"playerAnimRight",
        frames:this.anims.generateFrameNumbers("playerRight", {start:0, end: 3}),
        frameRate: 5,
        repeat: -1,
    });
    /*.body.setAllowGravity(false);
    player.body.immovable=true;
    player.body.moves=false;*/
    //Usar setVelocity para colisões sem interferir no movimento. Fazer teste!
    this.anims.create({
        key:"enemyAnim",
        frames:this.anims.generateFrameNumbers("enemy", {start:0, end:18}),
        frameRate:9,
        repeat:-1,
    });
    enemy = this.physics.add.sprite(1200, 298, "enemy").play("enemyAnim");
    enemy.setScale(0.3);
    enemy.setCollideWorldBounds(true);
    enemy.setVelocityX(-500);
    this.anims.create({
        key:"enemyAnimRight",
        frames:this.anims.generateFrameNumbers("enemyR", {start:0, end:18}),
        frameRate: 9,
        repeat: -1,
    });
    swords=this.physics.add.group({
        defaultKey: "swordRight",
        maxSize: 2,
        runChildUpdate: true
    });

    const floor = this.physics.add.staticGroup();
    floor.create(730, 500, "floor").setScale(1.5).refreshBody();

    this.physics.add.collider(player, floor);
    this.physics.add.collider(enemy,floor);
    this.physics.add.overlap(player, enemy, hitPlayer, null, this);
    this.physics.add.overlap(swords, enemy, hitEnemy, null, this);
    this.physics.add.overlap(enemy, swords, hitEnemy, null, this);

    cursors=this.input.keyboard.createCursorKeys();
    scoreText=this.add.text(16,16, "Pontuação: 0", {fontSize: "20px", fontFamily:"Comic Sans MS", fill: "white"});
    livesText=this.add.text(16,45, "Vidas: 3", {fontSize:"20px", fontFamily: "Comic Sans MS", fill: "white"});
    enemyLivesText=this.add.text(1293, 16, `Vida do inimigo: ${enemyLives}`, {fontSIze:"20px", fontFamily: "Comic Sans MS", fill:"red"});
    victoryText=this.add.text(605,310, "Você derrotou o inimigo!", {fontSize: "50px", fontFamily:"Comic Sans MS", fill:"green"}).setVisible(false);
    
}
function update() {
    player.setVelocity(0)
    if(cursors.left.isDown) {
        player.setVelocityX(-160);
        player.play("playerAnimRight", true);
        playerDirection="left";
    }
    else if(cursors.right.isDown) {
        player.setVelocityX(160);
        player.play("playerAnim", true);
        playerDirection="right";
    }
    else if (cursors.up.isDown) {
        player.setVelocityY(-360);
    }
    else if (cursors.down.isDown) {
        player.setVelocityY(200);
    }

    if (enemy.body.blocked.left) {
        enemy.play("enemyAnimRight", true);
        enemy.setVelocityX(500);
    }
    else if (enemy.body.blocked.right) {
        enemy.play("enemyAnim", true);
        enemy.setVelocityX(-500);
    }
    if(Phaser.Input.Keyboard.JustDown(cursors.space)) {
        playerSwords()
    }
    swords.children.each(sword => {
        if(sword.active && (sword.x<0 || sword.x>1500)) sword.setActive(false).setVisible(false);
    })
}

function hitPlayer(player, enemy) {
    if (!playerCollision) return;
    playerCollision = false;
    playerLives--;
    livesText.setText(`Vidas: ${playerLives}`);
    if (playerLives<=0) {
        player.disableBody(true,true);
        const gameOverText = this.add.text(605, 310, "Você foi derrotado.", {fontSize:"50px", fontFamily:"Comic Sans MS", fill: "red"});
    }
    else {
        player.setAlpha(0.5);
        this.time.delayedCall(1500,()=> {
            player.setAlpha(1);
            playerCollision=true;
        })
    }
}

function hitEnemy(enemy, swords) {
    swords.disableBody(true, true);
    enemyLives--;
    enemyLivesText.setText(`Vida do Inimigo: ${enemyLives}`);
    if (enemyLives<=0){
        enemy.disableBody(true,true);
        victoryText.setVisible(true);
    }
}

function playerSwords() {
    const sword = swords.get(player.x,player.y-20);
    if (sword) {
        sword.setActive(true).setVisible(true).setScale(0.2);
        sword.body.enable=true;
        sword.body.allowGravity=false;
        if(playerDirection==="right") {
            sword.setTexture("swordRight");
            sword.setVelocityX(700);
        }
        else {
            sword.setTexture("swordLeft");
            sword.setVelocityX(-700);
        }
    }
}