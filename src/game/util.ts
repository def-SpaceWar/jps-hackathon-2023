import AnimatedText from "../render/animated_text";

export type Vector2D = [x: number, y: number];

export class Listener<K extends keyof WindowEventMap> {
  constructor(
    public target: Window | Document | HTMLElement,
    public type: K,
    public listener: (ev: WindowEventMap[K]) => any,
    public options?: boolean | AddEventListenerOptions
  ) {
    target.addEventListener(type, listener as EventListener, options);
  }

  remove() {
    this.target.removeEventListener(
      this.type,
      this.listener as EventListener,
      this.options
    );
  }
}

export type Drawable = {
  draw: (ctx: CanvasRenderingContext2D) => void;
};

export const loadImage = (imageUrl: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (e: any) => {
      reject(e);
    };
  });
};

export type RectCollider = {
  x: number,
  y: number,
  w: number,
  h: number
};

export const normalize = (v: Vector2D): Vector2D => {
  const magnitude = Math.sqrt(v[0]**2 + v[1]**2);
  return [v[0]/magnitude, v[1]/magnitude];
};

export const blackScreen = (ctx: CanvasRenderingContext2D, text: string, time: number, x: number, y: number) => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "100px Comic Sans MS";
  ctx.fillText(text, x, y);

  return new Promise((resolve, _reject) => {
    setTimeout(() => {
      resolve(null);
    }, time * 1000);
  });
};

export const textBlob = async(ctx: CanvasRenderingContext2D, lines: string[]) => {
  const readSpeed = 2.5;

  const animLines: AnimatedText[] = [];

  for (let i = 0; i < lines.length; i++) {
    animLines.push(new AnimatedText([30, 30 + (i * 60), ctx.canvas.width - 60], lines[i], readSpeed));
  }

  const spaceCaption = new AnimatedText(
    [220, 350, 1000], "Press Space To Continue", readSpeed * 4 / 3, 30,
    { color: "#2f8", strokeColor: "#1B5" }, 1
  );

  let animationLoop = requestAnimationFrame(drawLoop);

  function drawLoop() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = "#333";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    animLines[0].draw(ctx);
    for (let i = 0; i < animLines.length-1; i++) {
      if (animLines[i].isDone) animLines[i+1].draw(ctx);
    }
    if (animLines[animLines.length-1].isDone) spaceCaption.draw(ctx);

    animationLoop = requestAnimationFrame(drawLoop);
  }

  return new Promise((resolve, _reject) => {
    async function spaceHit(e: KeyboardEvent) {
      if (e.key == " ") {
        document.removeEventListener("keypress", spaceHit);
        cancelAnimationFrame(animationLoop);
        resolve(null);
      }
    }

    document.addEventListener("keypress", spaceHit)
  });
};

export const pause = (t: number): Promise<null> => {
  return new Promise((res) => {
    setTimeout(() => {
      res(null);
    }, t * 1000);
  });
};