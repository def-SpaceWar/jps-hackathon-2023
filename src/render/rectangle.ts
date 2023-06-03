export class Rectangle {
    constructor(
        public x: number, public y: number,
        public w: number, public h: number,
        public color: string | CanvasGradient | CanvasPattern,
        public rotation = 0
    ) {}
                                                                                                        
    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.translate(-this.w / 2, -this.h / 2);
        ctx.fillRect(0, 0, this.w, this.h);
        ctx.restore();
    }
}