export type DrawSystem = {
    ctx: CanvasRenderingContext2D;
}

export const drawSystem = (id: string, width = 800, height = 800): DrawSystem => {
    const canvas = document.getElementById(id)!.appendChild(document.createElement('canvas')),
    ctx = canvas.getContext('2d')!;

    canvas.width = width;
    canvas.height = height;
    ctx.imageSmoothingEnabled = false;

    return {ctx};
};