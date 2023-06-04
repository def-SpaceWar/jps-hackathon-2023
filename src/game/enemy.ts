import enemy1SpriteSheet from "../assets/npc/enemy_1/enemy_1";
import enemy1TriangleateSpriteSheet from "../assets/npc/enemy_1/enemy_1_triangleate";
import enemy1TriangleateBlinkSpriteSheet from "../assets/npc/enemy_1/enemy_1_triangleate_blink";
import enemy2SpriteSheet from "../assets/npc/enemy_2/enemy_2";
import enemy2TriangleateSpriteSheet from "../assets/npc/enemy_2/enemy_2_triangleate";
import enemy2TriangleateBlinkSpriteSheet from "../assets/npc/enemy_2/enemy_2_triangleate_blink";
import { AnimatedSprite } from "../render/animated_sprite";
import { Player } from "./player";
import { Listener, pause, type Vector2D } from "./util";
import battleMusic from '../assets/background/battle.mp3';
import { height, width } from "../main";

enum BattleType {
  Qwe,
}

const battleTypes = [BattleType.Qwe];

type QweInfo = [a: number, b: number, c: number];

// a < b < c
const pythagTriples: [a: number, b: number, c: number][] = [
  [3, 4, 5],
  [6, 8, 10],
  [9, 12, 15],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
];

export class Enemy {
  sprite: AnimatedSprite;
  blinking = false;
  blinkTimer = 0;
  blinkTime = 3;
  blinkSpeed = 10;
  color: string;

  range: number;
  battleType: BattleType;
  isCutsceneDone = false;
  firstTime = true;
  oldPositions: [enemy: Vector2D, player: Vector2D];

  qweInfo: QweInfo;
  direction: "q" | "w" | "e" | undefined;
  playerLose = false;
  playerWin = false;
  listener: Listener<"keydown"> | undefined;
  shots = 0;
  trianglesSolved = 0;
  spawnSpeed = 1;

  transforming = false;
  transformed = false;
  fightAudio: HTMLAudioElement | undefined;

  constructor(
    public x: number,
    public y: number,
    public w: number,
    public h: number,
    public enemyType: 1 | 2
  ) {
    switch (enemyType) {
      case 1:
        this.sprite = new AnimatedSprite(x, y, w, h, 0, enemy1SpriteSheet);
        this.range = 175;
        this.color = "#f004";
        break;
      case 2:
        this.sprite = new AnimatedSprite(x, y, w, h, 0, enemy2SpriteSheet);
        this.range = 150;
        this.color = "#90f4";
        break;
    }

    this.battleType =
      battleTypes[Math.floor(Math.random() * battleTypes.length)];

    this.oldPositions = [
      [0, 0],
      [0, 0],
    ];

    this.qweInfo =
      pythagTriples[Math.floor(Math.random() * pythagTriples.length)];
  }

  blink() {
    if (this.blinking) this.sprite.animation = 1;
    this.sprite.animation = 1;
    this.blinking = true;
  }

  update(dt: number) {
    if (this.blinking) {
      this.sprite.animation += this.blinkSpeed * dt;
      if (Math.floor(this.sprite.animation) == 0) {
        this.blinking = false;
      }
    }

    this.blinkTimer -= dt;
    if (this.blinkTimer <= 0 && !this.transforming) {
      this.blink();
      this.blinkTimer = this.blinkTime + Math.random();
    }

    this.sprite.x = this.x;
    this.sprite.y = this.y;
    this.sprite.update();
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.transformed) {
      ctx.save();
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    this.sprite.draw(ctx);
  }

  inRange(player: Player, callback: (enemy: Enemy) => void) {
    if (
      (player.pos[0] - this.x) ** 2 + (player.pos[1] - this.y) ** 2 >
      this.range ** 2
    )
      return;
    callback(this);
  }

  attack(player: Player) {
    this.fightAudio = new Audio(battleMusic);
    this.fightAudio?.play();
    if (this.transformed) return;
    player.isFightingEnemy = true;
    player.enemyFighting = this;
    player.isCentered = false;
    this.oldPositions = [[this.x, this.y], [...player.pos]];
    this.x = width / 2;
    this.y = height / 2;
    [player.sprite.x, player.sprite.y] = [width / 2, height / 2];
    [this.sprite.x, this.sprite.y] = [width / 2, height / 2];
  }

  renderCutscene(ctx: CanvasRenderingContext2D, player: Player, dt: number) {
    if (this.firstTime) {
      ctx.canvas.style.backgroundImage = `url(/background_${this.enemyType}.png)`;
      [player.sprite.x, player.sprite.y] = [0, height / 2];
      [this.sprite.x, this.sprite.y] = [width, height / 2];
      this.firstTime = false;
      if (this.enemyType == 2) this.spawnSpeed = 2;
    }

    player.sprite.rotation = 0;
    player.sprite.animation = 0;
    this.sprite.rotation = 0;
    this.sprite.animation = 0;

    this.sprite.x -= 250 * dt;
    this.sprite.update();
    this.sprite.draw(ctx);

    player.sprite.x += 250 * dt;
    player.sprite.update();
    player.draw(ctx);

    if (player.sprite.x > width / 2 - player.sprite.w / 2) {
      this.isCutsceneDone = true;
      this.firstTime = true;
    }
  }

  renderBattle(ctx: CanvasRenderingContext2D, player: Player, dt: number) {
    if (!this.isCutsceneDone) {
      this.renderCutscene(ctx, player, dt);
      return;
    }
    switch (this.battleType) {
      case BattleType.Qwe:
        this.Qwe(ctx, player, dt);
        break;
    }
  }

  Qwe(ctx: CanvasRenderingContext2D, player: Player, dt: number) {
    if (this.firstTime) {
      this.firstTime = false;
      this.listener = new Listener(document, "keydown", (e) => {
        switch (e.key) {
          case "q":
          case "w":
          case "e":
            if (e.key == this.direction && this.shots > 0) {
              this.direction = undefined;
              this.shots -= 1;
              this.spawnSpeed *= 1.5;
            } else if (e.key != this.direction) this.playerLose = true;
            break;
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
            if (parseInt(e.key) == this.qweInfo[0]) {
              this.shots += 1;
              this.trianglesSolved += 1;
              this.qweInfo =
                pythagTriples[Math.floor(Math.random() * pythagTriples.length)];
            } else {
              this.playerLose = true;
            }
            break;
        }
      });
    }

    if (
      Math.random() < 0.005 * this.spawnSpeed &&
      this.direction == undefined
    ) {
      this.direction = ["q", "w", "e"][Math.floor(Math.random() * 3)] as
        | "q"
        | "w"
        | "e";

      switch (this.direction) {
        case "q":
          this.sprite.y = height + 100;
          this.sprite.x = 0 - 100;
          break;
        case "w":
          this.sprite.x = width / 2;
          this.sprite.y = 0 - 100;
          break;
        case "e":
          this.sprite.y = height + 100;
          this.sprite.x = width + 100;
          break;
      }
    }

    if (this.trianglesSolved > 5) {
      this.playerWin = true;
    }

    let speed = 100;
    if (this.enemyType == 2) speed *= 1.5;
    switch (this.direction) {
      case "q":
        this.sprite.x += speed * dt;
        this.sprite.y -= speed * dt;
        break;
      case "w":
        this.sprite.y += speed * dt;
        break;
      case "e":
        this.sprite.x -= speed * dt;
        this.sprite.y -= speed * dt;
        break;
    }

    ctx.save();
    ctx.fillStyle = this.color.substring(0, this.color.length - 1);
    ctx.beginPath()
    ctx.lineTo(width / 2, (height / 2) * 1.5 - 80);
    ctx.lineTo((width / 4) * 3, height / 2 - 80);
    ctx.lineTo(width / 4, height / 2 - 80);
    ctx.closePath();
    ctx.fill();
    ctx.font = "50px Comic Sans MS";
    ctx.fillText("[q]", 20, height - 50, width);
    ctx.fillText("[w]", width / 2 - 40, 50, width);
    ctx.fillText("[e]", width - 100, height - 50, width);
    ctx.fillStyle = "#ff5";
    ctx.fillText("?", width / 2 - 150, height / 2 + 50, width);
    ctx.fillText(`${this.qweInfo[2]}`, width / 2 - 40, 300, width);
    ctx.fillText(`${this.qweInfo[1]}`, width / 2 + 110, height / 2 + 50, width);
    ctx.fillText(
      `Charges: [${this.shots}]`,
      width / 2 - 150,
      height - 50,
      width
    );
    ctx.restore();

    switch (this.direction) {
      case "q":
      case "e":
        if (this.sprite.y < height / 2) this.playerLose = true;
        break;
      case "w":
        if (this.sprite.y > height / 2) this.playerLose = true;
        break;
    }

    if (this.direction) {
      this.sprite.update();
      this.sprite.draw(ctx);
    }

    player.sprite.x = width / 2;
    player.sprite.y = height / 2;
    player.sprite.update();
    player.sprite.draw(ctx);

    if (this.playerLose) {
      player.die();
      player.isFightingEnemy = false;
      player.enemyFighting = null;
      player.isCentered = true;
      [this.x, this.y] = this.oldPositions[0];
      player.pos = this.oldPositions[1];
      this.isCutsceneDone = false;
      this.firstTime = true;
      this.playerLose = false;
      this.listener?.remove();
      this.direction = undefined;
      this.shots = 0;
      this.trianglesSolved = 0;
      this.spawnSpeed = 1;
      this.fightAudio?.pause();
      this.fightAudio = undefined;
    }

    if (this.playerWin) {
      player.isFightingEnemy = false;
      player.enemyFighting = null;
      player.isCentered = true;
      player.pos = this.oldPositions[1];
      [this.x, this.y] = this.oldPositions[0];
      this.transform();
      player.squaresConverted += 1;
      this.listener?.remove();
      this.direction = undefined;
      this.shots = 0;
      this.trianglesSolved = 0;
      this.spawnSpeed = 1;
      this.fightAudio?.pause();
      this.fightAudio = undefined;
    }
  }

  async transform() {
    this.transformed = true;
    this.transforming = true;
    switch (this.enemyType) {
      case 1:
        this.sprite = new AnimatedSprite(
          this.x,
          this.y,
          this.w,
          this.h,
          0,
          enemy1TriangleateSpriteSheet
        );
        break;
      case 2:
        this.sprite = new AnimatedSprite(
          this.x,
          this.y,
          this.w,
          this.h,
          0,
          enemy2TriangleateSpriteSheet
        );
        break;
    }

    while (
      Math.floor(this.sprite.animation) !=
      this.sprite.clipLocs.length - 1
    ) {
      await pause(0.1);
      this.sprite.animation += 1;
    }

    switch (this.enemyType) {
      case 1:
        this.sprite = new AnimatedSprite(
          this.x,
          this.y,
          this.w,
          this.h,
          0,
          enemy1TriangleateBlinkSpriteSheet
        );
        break;
      case 2:
        this.sprite = new AnimatedSprite(
          this.x,
          this.y,
          this.w,
          this.h,
          0,
          enemy2TriangleateBlinkSpriteSheet
        );
        break;
    }

    this.transforming = false;
  }
}
