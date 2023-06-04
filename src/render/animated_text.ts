export default class AnimatedText {
  x: number;
  y: number;
  w: number;

  color: string;
  strokeColor: string;

  private isUpdatingStartedYet = false;
  private updateIntervalId = 0;
  isDone = false;

  private shownText: string = "";
  private stringIdx: number = 0;

  constructor(
    space: [x: number, y: number, w: number],
    public text: string,
    public readSpeed: number,
    public fontSize = 60,
    colors: { color?: string; strokeColor?: string } = {},
    public strokeWidth: number = 3
  ) {
    this.x = space[0];
    this.y = space[1];
    this.w = space[2];

    this.color = colors.color || "#fff";
    this.strokeColor = colors.strokeColor || "#AAA";
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.isUpdatingStartedYet) {
      this.updateIntervalId = setInterval(
        this.update(this),
        100 / this.readSpeed
      ) as unknown as number;
      this.isUpdatingStartedYet = true;
    }

    ctx.save();
    ctx.font = `${this.fontSize}px Comic Sans MS`;
    ctx.fillStyle = this.color;
    ctx.fillText(this.shownText, this.x, this.y + this.fontSize, this.w);
    //ctx.strokeStyle = this.strokeColor;
    //ctx.lineWidth = this.strokeWidth;
    //ctx.strokeText(this.shownText, this.x, this.y + this.fontSize, this.w);
    ctx.restore();
  }

  update(self: AnimatedText) {
    return () => {
      if (self.stringIdx == self.text.length) {
        clearInterval(self.updateIntervalId);
        self.isDone = true;
        return;
      }
      self.shownText += self.text[this.stringIdx];
      self.stringIdx++;
    };
  }

  setText(text: string) {
    this.shownText = '';
    this.text = text;
    this.stringIdx = 0;
    this.isDone = false;
    this.isUpdatingStartedYet = false;
  }
}
