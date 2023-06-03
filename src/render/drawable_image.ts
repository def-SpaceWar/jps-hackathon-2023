export class DrawableImage {
    constructor(
        public x: number, public y: number,
        public w: number, public h: number,
        public image: CanvasImageSource,
        public rotation = 0
    ) {}

    draw(ctx: CanvasRenderingContext2D, source?: [sx: number, sy: number, sw: number, sh: number]) {
        ctx.save();
        ctx.translate(Math.floor(this.x), Math.floor(this.y));
        ctx.rotate(this.rotation);
        ctx.translate(-this.w / 2, -this.h / 2);
        if (source) ctx.drawImage(this.image, ...source, 0, 0, this.w, this.h);
        else ctx.drawImage(this.image, 0, 0, this.w, this.h);
        ctx.restore();
    }
}