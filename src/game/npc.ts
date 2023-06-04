import npc1SpriteSheet from "../assets/npc/npc_1/npc_1";
import npc2SpriteSheet from "../assets/npc/npc_2/npc_2";
import sageSpriteSheet from "../assets/npc/sage/sage";
import { width } from "../main";
import { AnimatedSprite } from "../render/animated_sprite";
import AnimatedText from "../render/animated_text";
import { Rectangle } from "../render/rectangle";
import { Player } from "./player";
import { Listener } from "./util";

export class Npc {
  animatedTexts: AnimatedText[];
  sprite: AnimatedSprite;
  blinking = false;
  blinkTimer = 0;
  blinkTime = 5;
  blinkSpeed = 10;
  bgRect: Rectangle;

  range = 250;

  constructor(
    public x: number,
    public y: number,
    public w: number,
    public h: number,
    public dialog: string[][],
    npcType: 1 | 2 | "sage"
  ) {
    this.animatedTexts = [];
    this.bgRect = new Rectangle(50, 50, 400, 400, 'grey');

    switch (npcType) {
      case 1:
        this.sprite = new AnimatedSprite(x, y, w, h, 0, npc1SpriteSheet);
        break;
      case 2:
        this.sprite = new AnimatedSprite(x, y, w, h, 0, npc2SpriteSheet);
        break;
      case "sage":
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
      let i = 0;
      for (i = 0; i < newText.length; i++) {
        this.animatedTexts.push(
          new AnimatedText([100, 100 + i * 40, 600], newText[i], 20, 25)
        );
      }
      this.animatedTexts.push(
        new AnimatedText(
          [100, 100 + i * 50, 600],
          "Press [e] to continue.",
          32767,
          30,
          { color: "#00FFAE" }
        )
      );
      this.bgRect = new Rectangle(width/2, i * 25 + 120, width - 100, i * 50 + 100, 'grey');
      return true;
    }

    return false;
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
    if (this.dialog.length > 0) {
      ctx.save();
      ctx.fillStyle = '#00FFAE44'
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    this.sprite.draw(ctx);

    if (this.dialog.length > 0) {
      ctx.save();
      ctx.fillStyle = "#354";
      ctx.fillRect(this.sprite.x + 23, this.sprite.y - 60, 70, 65);
      ctx.fillStyle = "#00FFAE";
      ctx.font = "50px Comic Sans MS";
      ctx.fillText("[e]", this.sprite.x + 25, this.sprite.y - 15);
      ctx.restore();
    }
  }

  drawText(ctx: CanvasRenderingContext2D) {
    if (this.animatedTexts.length == 0) return;
    this.bgRect.draw(ctx);
    for (let i = 0; i < this.animatedTexts.length; i++) {
      this.animatedTexts[i].draw(ctx);
      if (!this.animatedTexts[i].isDone) break;
    }
  }

  listen(player: Player) {
    const oldSpeed = player.speed;
    return new Listener(document, "keydown", (e) => {
      switch (e.key) {
        case "E":
        case "e":
          if ((player.pos[0] - this.x) ** 2 + (player.pos[1] - this.y) > this.range**2)
            return;
          player.speed = 0;
          if (!this.genDialogue()) {
            this.animatedTexts = [];
            player.speed = oldSpeed;
          }
          break;
      }
    });
  }
}
