import enemy1SpriteSheet from "../assets/npc/enemy_1/enemy_1";
import enemy2SpriteSheet from "../assets/npc/enemy_2/enemy_2";
import { AnimatedSprite } from "../render/animated_sprite";
import { Player } from "./player";

enum BattleType {
  QWE
};

const battleTypes = [ BattleType.QWE ];

export class Enemy {
  sprite: AnimatedSprite;
  blinking = false;
  blinkTimer = 0;
  blinkTime = 5;
  blinkSpeed = 10;

  battleType: BattleType;
  isCutsceneDone = false;
  cutsceneState = {enemy: 0, player: 1};

  constructor(
    public x: number,
    public y: number,
    public w: number,
    public h: number,
    enemyType: 1 | 2
  ) {
    switch (enemyType) {
      case 1:
        this.sprite = new AnimatedSprite(x, y, w, h, 0, enemy1SpriteSheet);
        break;
      case 2:
        this.sprite = new AnimatedSprite(x, y, w, h, 0, enemy2SpriteSheet);
        break;
    }

    this.battleType = battleTypes[Math.floor(Math.random() * battleTypes.length)];
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
    if (this.blinkTimer <= 0) {
      this.blink();
      this.blinkTimer = this.blinkTime + Math.random();
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.sprite.draw(ctx);
  }
  
  attack(player: Player) {
    player.isFightingEnemy = true;
    player.enemyFighting = this;
  }

  renderCutscene(ctx: CanvasRenderingContext2D, player: Player, dt: number) {
  }

  renderBattle(ctx: CanvasRenderingContext2D, player: Player, dt: number) {
    if (!this.isCutsceneDone) this.renderCutscene(ctx, player, dt);
    switch (this.battleType) {
      case BattleType.QWE:
        this.renderQWE(ctx, player);
        break;
    }
  }

  renderQWE(ctx: CanvasRenderingContext2D, player: Player) {
    //
  }
}