import { type SpriteSheetData } from "../assets/image_types";
import { type Vector2D, loadImage } from "../game/util";
import { DrawableImage } from "./drawable_image";

export class AnimatedSprite {
  animation: number;
  clipLocs: Vector2D[];
  clipWidth: number;
  clipHeight: number;
  drawableImage: DrawableImage;
  loaded: boolean;

  constructor(
    public x: number,
    public y: number,
    public w: number,
    public h: number,
    public rotation: number,
    spriteSheet: SpriteSheetData,
    animation?: number
  ) {
    this.animation = animation ? animation : 0;
    this.clipLocs = [];
    this.clipWidth = spriteSheet.width;
    this.clipHeight = spriteSheet.height;
    for (let i = 0; i < spriteSheet.total; i++) {
      const row = Math.floor(i / spriteSheet.colCount);
      const col = i % spriteSheet.colCount;
      this.clipLocs.push([col * this.clipWidth, row * this.clipHeight]);
    }

    this.loaded = false;
    this.drawableImage = new DrawableImage(0, 0, 0, 0, document.createElement('img'), 0);
    this.load(spriteSheet);
  }

  async load(spriteSheet: SpriteSheetData) {
    const image = await loadImage(spriteSheet.url);
    this.drawableImage = new DrawableImage(this.x, this.y, this.w, this.h, image, this.rotation);
    this.loaded = true;
  }

  update() {
    this.drawableImage.x = this.x;
    this.drawableImage.y = this.y;
    this.drawableImage.w = this.w;
    this.drawableImage.h = this.h;
    this.drawableImage.rotation = this.rotation;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.loaded) return;
    this.animation = this.animation % this.clipLocs.length;
    this.drawableImage.draw(ctx, [...this.clipLocs[Math.floor(this.animation)], this.clipWidth, this.clipHeight]);
  }
}
