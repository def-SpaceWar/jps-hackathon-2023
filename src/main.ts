import "./style.css";
import { renderLoop, RenderState } from "./render/render_loop";
import { Player } from "./game/player";
import { drawSystem } from "./render/draw_system";
import { createMap } from "./game/map";
import { blackScreen, Listener, type RectCollider } from "./game/util";
import { world1Map, world1Wall } from "./world1";
import { Npc } from "./game/npc";
import { Enemy } from "./game/enemy";
import AnimatedText from "./render/animated_text";
import { Rectangle } from "./render/rectangle";
import backgroundMusicUrl from "./assets/background/background.mp3";
import backgroundSavannahUrl from './assets/background/savannah.mp3';

export const [width, height] = [800, 800];
const { ctx } = drawSystem("app", width, height);
export const DEBUG = false;

onload = async () => {
  await blackScreen(ctx, "Loading...", 0, 100, 400);
  await blackScreen(ctx, 'Triangle-1', 3, 100, 400);
  await triangle1();
  await blackScreen(ctx, 'Thanks!', 2, 200, 400);
  await blackScreen(ctx, 'Triangleations', 2, 100, 400);
  await blackScreen(ctx, 'Demo', 2, 100, 400);
  await blackScreen(ctx, '', 2, 100, 400);
};

export const bgMusic = new Audio(backgroundMusicUrl);
export const bgSavannah = new Audio(backgroundSavannahUrl);

async function triangle1() {
  bgMusic.play();
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
    300,
    2595,
    100,
    100,
    [
      [
        "Hello young conquerer!",
        "...",
        "I see you have come to take over Quadratburg.",
      ],
      [
        "To do so, you must first traverse the grasslands",
        "then, you shall reach my friend.",
        "...",
        "He will teach you the ways.",
      ],
      [
        "You shall help me accomplish my task in stride",
        "...",
        "We shall take over this land!",
      ],
      [
        "Now, go and obliterate these poor squares!",
        "...",
        "But avoid the enemies on your first mission. ",
      ],
    ],
    "sage"
  );

  const sageListener = sage.listen(player);
  const sageBarriers = [
    { x: 200, y: 2050, w: 200, h: 100 },
    { x: 450, y: 2150, w: 500, h: 100 },
    { x: 800, y: 2250, w: 400, h: 100 },
  ];
  const travellerBarriers = [
    { x: 550, y: 450, w: 100, h: 900 }
  ];
  const drawHitboxes = (rs: RectCollider[]) => {
    ctx.save();
    ctx.strokeStyle = "#f00";
    rs.forEach((r) => ctx.strokeRect(r.x - r.w / 2, r.y - r.h / 2, r.w, r.h));
    ctx.restore();
  };

  const friend = new Npc(
    2800,
    200,
    100,
    75,

    [
      [
        "Ah, I see the sage sent you here",
        "...",
        "You've come to conquer those squares right?",
      ],
      ["So, I give you this my brother in arms:", "...", "The Triangleator"],
      [
        "This machine shall ki- I mean",
        "transform these squares into a blob",
        "so they can become the most magnificent shape!",
      ],
      [
        "Now how do you defeat these enemies?",
        "...",
        "When you get their attention a battle starts.",
      ],
      [
        "You will be located in a triangle.",
        "...",
        "This triangle will act as a shield from the attacks.",
      ],
      [
        "A pythagorean triple problem will then appear.",
        "...",
        "To charge your shield you have to solve for the '?'",
        "by pressing the number on your keyboard.",
      ],
      [
        "Additionally, the square will come",
        "at you from a random direction.",
        "...",
        "You will have to press 'q,' 'w,' or 'e' corresponding",
        "to the direction to fend off it's attacks.",
      ],
      [
        "Repeat this a couple times and the enemy will tire",
        "...",
        "Once it is tired, you can triangleate it!",
      ],
      [
        "Be careful, if you get hit or miss a triple",
        "you will be sent back to your spawnpoint.",
      ],
      ["Now go on and test it out", "...", "Triangleate four enemies!"],
    ],
    2
  );
  const friendListener = friend.listen(player);

  const traveller = new Npc(
    300,
    500,
    100,
    75,
    [
    ],
    1
  );
  const travellerListener = traveller.listen(player);

  const enemies: Enemy[] = [
    new Enemy(1900, 1200, 80, 80, 1),
    new Enemy(1700, 900, 80, 80, 1),
    new Enemy(800, 2000, 80, 80, 1),
    new Enemy(1200, 1400, 80, 80, 1),
  ];

  let worldOver = false;
  let timer = 2;

  const popup = new AnimatedText(
    [50, 20, width - 100],
    "Talk to the sage to start your journey!",
    5,
    38
  );
  const popupBackground = new Rectangle(
    width / 2,
    50,
    width - 80,
    75,
    "#aa5500"
  );
  let trainingComplete = false;
  const missionText = new AnimatedText([50, 20, width - 100], "", 5, 35);
  const missions = [
    "Avoid the squares and talk to his friend!", //0
    "Triangleate four squares to train yourself!", //1
    "Training Complete: Go talk to your friend!", //2
    "Report your training back to the Sage!", //3
    "Triangleate two more Squares to level up!", //4
    "Talk to the Savannah traveller for help!", //5
    "Triangleate 5 advanced Savannah enemies!", //6
    "Confront the boss to conquer Quadratburg!", //7
  ];

  let missionNumber = -1;

  missionText.setText(missions[missionNumber]);

  await renderLoop((dt) => {
    ctx.clearRect(0, 0, width, height);

    if (player.isFightingEnemy) {
      player.enemyFighting?.renderBattle(ctx, player, dt);
      return RenderState.SUCCESS;
    }

    if (player.squaresConverted >= 6) bgSavannah.play();
    else bgMusic.play();

    const newH: RectCollider[] = [...hitboxes];
    if (sage.dialog.length > 0 && missionNumber < 0) newH.push(...sageBarriers);
    if (traveller.dialog.length > 0) newH.push(...travellerBarriers);
    player.update(dt, newH);
    sage.update(dt);
    friend.update(dt);
    enemies.forEach((enemy) => enemy.update(dt));
    enemies.forEach((e) =>
      e.inRange(player, (enemy) => {
        if (e.transformed) return;
        let distance = Math.sqrt(
          (player.pos[0] - enemy.x) ** 2 + (player.pos[1] - enemy.y) ** 2
        );
        const normal = [
          (player.pos[0] - enemy.x) / distance,
          (player.pos[1] - enemy.y) / distance,
        ];

        while (distance < enemy.range + 5) {
          player.pos[0] += normal[0];
          player.pos[1] += normal[1];
          distance = Math.sqrt(
            (player.pos[0] - enemy.x) ** 2 + (player.pos[1] - enemy.y) ** 2
          );
        }

        if (friend.dialog.length > 0 || missionNumber < 1) {
          player.die();
        } else {
          bgMusic.pause();
          bgSavannah.pause();
          enemy.attack(player);
        }
      })
    );

    ctx.save();
    if (player.isCentered) {
      ctx.translate(-player.pos[0] + width / 2, -player.pos[1] + height / 2);
    }
    level.forEach((t) => t.draw(ctx));
    hitboxes.forEach((t) => t.draw(ctx));
    sage.draw(ctx);
    friend.draw(ctx);
    traveller.draw(ctx);
    enemies.forEach((e) => e.draw(ctx));
    if (DEBUG) drawHitboxes(newH);
    ctx.restore();

    player.draw(ctx);

    popupBackground.draw(ctx);
    if (
      (sage.dialog.length > 0 || sage.animatedTexts.length > 0) &&
      missionNumber < 1
    ) {
      popup.draw(ctx);
    } else {
      missionText.draw(ctx);
    }

    switch (player.squaresConverted) {
      case 0:
        if (sage.dialog.length == 0 && sage.animatedTexts.length == 0) {
          missionNumber = 0;
        }
        if (friend.dialog.length == 0 && friend.animatedTexts.length == 0) {
          missionNumber = 1;
        }
        break;
      case 4:
        if (
          friend.dialog.length == 0 &&
          missionNumber < 3 &&
          !trainingComplete
        ) {
          missionNumber = 2;
          friend.dialog = [
            ["I see, you are a natural."],
            [
              "Report your results to the Sage.",
              "...",
              "He'll be happy about it!",
            ],
          ];
          trainingComplete = true;
        }

        if (
          friend.dialog.length == 0 &&
          trainingComplete &&
          missionNumber == 2
        ) {
          missionNumber = 3;
          trainingComplete = false;
          sage.dialog = [
            ["I see you have proven yourself to the cause."],
            ["There is another part of Quadratburg", "...", "The Savannah."],
            [
              "The Savannah is a far more dangerous area",
              "so I think you are up to the task now.",
            ],
            [
              "The Savannah is blocked off by a large wall.",
              "...",
              "Thankfully, there is a lake that goes underneath it.",
            ],
            [
              "You might be able to go under if you level up.",
              "...",
              "Level up by triangleating two more enemies!",
            ],
            [
              "Once you have leveled up you should find",
              "yourself through the lake in the Savannah",
            ],
          ];
        }
        if (sage.dialog.length == 0 && missionNumber == 3) {
          enemies.push(new Enemy(1100, 1600, 80, 80, 1));
          enemies.push(new Enemy(1400, 1000, 80, 80, 1));
          missionNumber = 4;
        }
        break;
      case 6:
        if (player.stage != 1) {
          player.respawn = () => {
            player.pos = [300, 700];
          };
          player.die();

          traveller.dialog = [
            ["So you've has been making all that noise huh?"],
            ["Here you will have to fight harder enemies", "...", "You should be able to do 5."],
            ["Once you do so, you can confront the boss."],
            ["Good Luck!"]
          ];
          enemies.push(new Enemy(1500, 400, 80, 80, 2));
          enemies.push(new Enemy(800, 500, 80, 80, 2));
          enemies.push(new Enemy(800, 200, 80, 80, 2));
          enemies.push(new Enemy(1100, 200, 80, 80, 2));
          enemies.push(new Enemy(1300, 400, 80, 80, 2));
        }
        
        player.stage = 1;
        missionNumber = 5;
        if (
          traveller.dialog.length == 0 &&
          traveller.animatedTexts.length == 0 &&
          missionNumber == 5
        ) {
          missionNumber = 6;
        }
        break;
      case 11:
        timer -= dt;
        if (timer <= 0) return RenderState.QUIT;
          break;
    }

    if (missionText.text != missions[missionNumber]) {
      missionText.setText(missions[missionNumber]);
    }

    sage.drawText(ctx);
    friend.drawText(ctx);
    traveller.drawText(ctx);

    if (worldOver) {
      playerKeyDown.remove();
      playerKeyUp.remove();
      sageListener.remove();
      friendListener.remove();
      travellerListener.remove();
      return RenderState.QUIT;
    }

    return RenderState.SUCCESS;
  });
}
