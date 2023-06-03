import "./style.css";
import { renderLoop, RenderState } from "./render/render_loop";
import { Player } from "./game/player";
import { drawSystem } from "./render/draw_system";
import { createMap } from "./game/map";
import { blackScreen, Listener, textBlob } from "./game/util";
import { world1Map, world1Wall }from "./world1";
import { Npc } from "./game/npc";

export const [width, height] = [800, 800];
const { ctx } = drawSystem("app", width, height);

window.onload = async () => {
  //await textBlob(ctx, ['Welcome!', 'hi2']);
  //await blackScreen(ctx, 'Triangle 1-1', 3, 100, 400);
  await world1();
  await blackScreen(ctx, 'Triangle 1-2', 3, 100, 400);
};

async function world1() {
  const player = new Player(width / 2, height / 2, 100, 75);
  const playerKeyDown = new Listener(document, "keydown", (e) => {
    switch (e.key) {
      case "a":
      case "ArrowLeft":
        player.move("left");
        break;
      case "d":
      case "ArrowRight":
        player.move("right");
        break;
      case "s":
      case "ArrowDown":
        player.move("down");
        break;
      case "w":
      case "ArrowUp":
        player.move("up");
        break;
    }
  });
  const playerKeyUp = new Listener(document, "keyup", (e) => {
    switch (e.key) {
      case "a":
      case "ArrowLeft":
        player.move("left", true);
        break;
      case "d":
      case "ArrowRight":
        player.move("right", true);
        break;
      case "s":
      case "ArrowDown":
        player.move("down", true);
        break;
      case "w":
      case "ArrowUp":
        player.move("up", true);
        break;
    }
  });

  const level = await createMap(world1Map, true);
  const hitboxes = await createMap(world1Wall);

  const npc = new Npc(
    200, 2495, 100, 100,
    [
      ['hey there traveller', 'hi ++'],
      ['hi again!']
    ],
    'sage'
  );
  const npcDialogue = new Listener(document, "keydown", (e) => {
    if (e.key != 'e') return;
    if (!npc.genDialogue()) {
      npc.animatedTexts = [];
    }
  });

  let worldOver = false;
  await renderLoop((dt) => {
    ctx.clearRect(0, 0, width, height);

    player.update(dt, hitboxes);
    npc.update(dt);

    ctx.save();
    if (player.isCentered) {
      ctx.translate(-player.pos[0] + width / 2, -player.pos[1] + height / 2);
    }
    level.forEach(t => t.draw(ctx));
    hitboxes.forEach(t => t.draw(ctx));
    npc.draw(ctx);
    ctx.restore();

    player.draw(ctx);
    npc.drawText(ctx);

    if (worldOver) {
      playerKeyDown.remove();
      playerKeyUp.remove();
      return RenderState.QUIT;
    }

    return RenderState.SUCCESS;
  });
}
