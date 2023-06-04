import "./style.css";
import { renderLoop, RenderState } from "./render/render_loop";
import { Player } from "./game/player";
import { drawSystem } from "./render/draw_system";
import { createMap } from "./game/map";
import {
  blackScreen,
  Listener,
  type RectCollider
} from "./game/util";
import { world1Map, world1Wall } from "./world1";
import { Npc } from "./game/npc";
import { Enemy } from "./game/enemy";
import AnimatedText from "./render/animated_text";
import { Rectangle } from "./render/rectangle";

export const [width, height] = [800, 800];
const { ctx } = drawSystem("app", width, height);

window.onload = async () => {
  //await textBlob(ctx, ['Welcome!', 'hi2']);
  //await blackScreen(ctx, 'Triangle 1-1', 3, 100, 400);
  await world1();
  await blackScreen(ctx, "Triangle 1-2", 3, 100, 400);
};

async function world1() {
  const player = new Player(width / 2, height / 2 + 2000, 100, 75);
  const playerKeyDown = new Listener(document, "keydown", (e) => {
    switch (e.key) {
      case "A":
      case "a":
      case "ArrowLeft":
        player.move("left");
        break;
      case "D":
      case "d":
      case "ArrowRight":
        player.move("right");
        break;
      case "S":
      case "s":
      case "ArrowDown":
        player.move("down");
        break;
      case "W":
      case "w":
      case "ArrowUp":
        player.move("up");
        break;
    }
  });
  const playerKeyUp = new Listener(document, "keyup", (e) => {
    switch (e.key) {
      case "A":
      case "a":
      case "ArrowLeft":
        player.move("left", true);
        break;
      case "D":
      case "d":
      case "ArrowRight":
        player.move("right", true);
        break;
      case "S":
      case "s":
      case "ArrowDown":
        player.move("down", true);
        break;
      case "W":
      case "w":
      case "ArrowUp":
        player.move("up", true);
        break;
    }
  });

  const level = await createMap(world1Map, true);
  const hitboxes = await createMap(world1Wall);

  const sage = new Npc(
    200,
    2495,
    100,
    100,
    [
    ["Hello young conquerer!", "...", "I see you have come to take over Quadratburg."], 
    ["To do so, you must first traverse the grasslands", "then, you shall reach my friend.", '...', "He will teach you the ways."],
    ['You shall help me accomplish my task in stride', '...', "We shall take over this land!"],
    ['Take this Triangle-ator and ki- I mean', 'transform these squares into a blob', 'so they can beocme the most magnificent shape!'],
    ["Now, go and obliterate these poor squares!"] 
    ],
    "sage"
  );
  const sageListener = sage.listen(player);
  const sageBarriers = [
    { x: 200, y: 2050, w: 200, h: 100 },
    { x: 450, y: 2150, w: 500, h: 100 },
    { x: 800, y: 2250, w: 400, h: 100 },
  ];
  const drawHitboxes = (rs: RectCollider[]) => {
    ctx.save();
    ctx.strokeStyle = "#f00";
    rs.forEach(r => ctx.strokeRect(r.x - r.w / 2, r.y - r.h / 2, r.w, r.h));
    ctx.restore();
  };

  const enemies: Enemy[] = [
    new Enemy(1000, 1800, 80, 80, 1)
  ]; 

  let worldOver = false;

  const popup = new AnimatedText([50,20,width - 100], 'Talk to the sage u stupid (triangle man)', 2, 50);
  let popupBackground = new Rectangle(width/2,50,width - 80,75,'#aa5500');

  await renderLoop((dt) => {
    ctx.clearRect(0, 0, width, height);

    if (player.isFightingEnemy) {
      player.enemyFighting?.renderBattle(ctx, player, dt);
      return RenderState.SUCCESS;
    }

    const newH: RectCollider[] = [...hitboxes];
    if (sage.dialog.length > 0) newH.push(...sageBarriers);
    player.update(dt, newH);
    sage.update(dt);
    enemies.forEach(enemy => {
      if ((player.pos[0] - enemy.x) ** 2 + (player.pos[1] - enemy.y) ** 2 > 25_000) return; 
      enemy.attack(player);
    });


    ctx.save();
    if (player.isCentered) {
      ctx.translate(-player.pos[0] + width / 2, -player.pos[1] + height / 2);
    }
    level.forEach((t) => t.draw(ctx));
    hitboxes.forEach((t) => t.draw(ctx));
    sage.draw(ctx);
    enemies.forEach(e => e.draw(ctx));
    drawHitboxes(newH);
    ctx.restore();

    player.draw(ctx);
    if (sage.dialog.length > 0 && sage.animatedTexts.length == 0) {
      //render ur popup\
      popupBackground.draw(ctx);      
      popup.draw(ctx);
    }
    sage.drawText(ctx);

    if (worldOver) {
      playerKeyDown.remove();
      playerKeyUp.remove();
      sageListener.remove();
      return RenderState.QUIT;
    }

    return RenderState.SUCCESS;
  });
}
