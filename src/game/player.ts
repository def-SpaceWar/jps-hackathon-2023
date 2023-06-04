import playerSpriteSheet from "../assets/player/player";
import { height, width } from "../main";
import { AnimatedSprite } from "../render/animated_sprite";
import { type Enemy } from "./enemy";
import { normalize, type RectCollider, type Vector2D } from "./util";

type Direction = "left" | "right" | "up" | "down";

export class Player {
  pos: Vector2D;
  dims: Vector2D;
  sprite: AnimatedSprite;
  movingDirections: Direction[] = [];

  blinking = false;
  blinkTimer = 0;
  speed = 300;
  lookingDown = false;

  isFightingEnemy = false;
  enemyFighting: Enemy | null = null;

  constructor(
    x: number,
    y: number,
    w: number,
    h: number,
    public rotation = 0,
    public isCentered = true
  ) {
    this.pos = [x, y];
    this.dims = [w, h];
    this.sprite = new AnimatedSprite(
      isCentered ? width / 2 : x,
      isCentered ? height / 2 : y,
      w,
      h,
      0,
      playerSpriteSheet
    );
  }

  move(direction: Direction, stop = false) {
    switch (direction) {
      case "left":
      case "right":
      case "up":
      case "down":
        if (!stop) {
          this.movingDirections.push(direction);
          this.movingDirections = this.movingDirections.filter(
            (v, i, s) => s.indexOf(v) == i
          );
        } else {
          this.movingDirections = this.movingDirections.filter(
            (v) => v != direction
          );
        }
        break;
    }
  }

  blink() {
    if (this.blinking) this.sprite.animation = 1;
    this.sprite.animation = 1;
    this.blinking = true;
  }

  update(dt: number, rectColliders: RectCollider[]) {
    rectColliders.forEach((collider) => {
      const isCollidingX = () => {
        if (
          this.pos[0] - this.dims[0] / 2 < collider.x + collider.w / 2 &&
          this.pos[0] + this.dims[0] / 2 > collider.x - collider.w / 2
        ) {
          return true;
        }
      };

      const isCollidingY = () => {
        if (
          this.pos[1] - this.dims[1] / 2 < collider.y + collider.h / 2 &&
          this.pos[1] + this.dims[1] / 2 > collider.y - collider.h / 2
        ) {
          return true;
        }
      };

      let vector: Vector2D = [
        this.pos[0] - collider.x,
        this.pos[1] - collider.y,
      ];
      vector = normalize(vector);

      while (isCollidingX() && isCollidingY()) {
        this.pos[0] += vector[0] / collider.w;
        this.pos[1] += vector[1] / collider.h;
      }
    });

    if (this.movingDirections.indexOf("right") != -1) {
      this.pos[0] += this.speed * dt;
      this.rotation = 0.15;
      if (this.lookingDown) this.rotation *= -1;
    }
    if (this.movingDirections.indexOf("left") != -1) {
      this.pos[0] -= this.speed * dt;
      this.rotation = -0.15;
      if (this.lookingDown) this.rotation *= -1;
    }
    if (this.movingDirections.indexOf("right") == -1) {
      if (this.movingDirections.indexOf("left") == -1) {
        this.rotation = 0;
      }
    }
    if (this.movingDirections.indexOf("up") != -1) {
      this.pos[1] -= this.speed * dt;
      this.rotation *= 1 / 2;
      this.lookingDown = false;
    }
    if (this.movingDirections.indexOf("down") != -1) {
      this.pos[1] += this.speed * dt;
      this.rotation *= 1 / 2;
      this.lookingDown = true;
    }

    if (this.blinking) {
      this.sprite.animation += 10 * dt;
      if (Math.floor(this.sprite.animation) == 0) {
        this.blinking = false;
      }
    }

    this.blinkTimer -= dt;
    if (this.movingDirections.length > 0) this.blinkTimer = 5;
    if (this.blinkTimer <= 0) {
      this.blink();
      this.blinkTimer = 5 + Math.random();
    }

    if (!this.isCentered) [this.sprite.x, this.sprite.y] = this.pos;
    [this.sprite.w, this.sprite.h] = this.dims;
    this.sprite.rotation = this.rotation + (this.lookingDown ? Math.PI : 0);
    this.sprite.update();
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.sprite.draw(ctx);
  }
}
