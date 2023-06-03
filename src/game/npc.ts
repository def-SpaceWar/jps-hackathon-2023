import npc1SpriteSheet from "../assets/npc/npc1/npc1";
import npc2SpriteSheet from "../assets/npc/npc2/npc2";
import sageSpriteSheet from "../assets/npc/sage/sage";
import { AnimatedSprite } from "../render/animated_sprite";
import AnimatedText from "../render/animated_text";

export class Npc {
  animatedTexts: AnimatedText[];
  sprite: AnimatedSprite;
  blinking = false;
  blinkTimer = 0;
  blinkTime = 5;
  blinkSpeed = 10;

  constructor(
    public x: number,
    public y: number,
    public w: number,
    public h: number,
    public dialog: string[][],
    npcType: 1 | 2 | 'sage'
  ) {
    this.animatedTexts = [];

    switch (npcType) {
      case 1:
        this.sprite = new AnimatedSprite(x, y, w, h, 0, npc1SpriteSheet);
        break;
      case 2:
        this.sprite = new AnimatedSprite(x, y, w, h, 0, npc2SpriteSheet);
        break;
      case 'sage':
        this.sprite = new AnimatedSprite(x, y, w, h, 0, sageSpriteSheet);
        this.blinkTime = 6;
        this.blinkSpeed = 4;
        break;
    }
  }

  genDialogue() {
    if (this.dialog.length > 0) {
      this.animatedTexts = [];
      const newText = this.dialog.shift()!;
      for (let i = 0; i < newText.length; i++) {
        this.animatedTexts.push(
          new AnimatedText([100, 100 + i * 100, 600], newText[i], 1.5, 50)
        );
        return true;
      }
    }

    return false;
  }

  blink() {
    if (this.blinking) this.sprite.animation = 1;
    this.sprite.animation = 1;
    this.blinking = true;
    console.log('hi');
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
    ctx.save();
    ctx.fillStyle = '#3fa';
    ctx.font = '50px Comic Sans MS';
    ctx.fillText('[e]', this.sprite.x, this.sprite.y);
    ctx.restore();
  }

  drawText(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.animatedTexts.length; i++) {
      this.animatedTexts[i].draw(ctx);
      if (!this.animatedTexts[i].isDone) break;
    }
  }
}
