import { loadImage } from "./util";
import { DrawableImage } from "../render/drawable_image";
import cobblestoneUrl from "../assets/background/cobblestone.png";
import grassUrl from "../assets/background/grass.png";
import dryGrassUrl from "../assets/background/dry_grass.png";
import stoneUrl from "../assets/background/stone.png";
import wallUrl from "../assets/background/wall.png";
import aguaUrl from "../assets/background/agua.png";
import flowerUrl from "../assets/background/flower.png";
import stoneGrass1Url from "../assets/background/stone_grass_1.png";
import stoneGrass2Url from "../assets/background/stone_grass_2.png";
import stoneDry1Url from "../assets/background/stone_dry_1.png";
import stoneDry2Url from "../assets/background/stone_dry_2.png";

export type Tile = "c" | "d" | "s" | "w" | "a" | "g" | 'f' | "p" | " ";
export type TileMap = Tile[][];

const TILE_SIZE = 100;
export const createMap = async (
  tileMap: TileMap,
  bg = false
): Promise<DrawableImage[]> => {
  const drawables: DrawableImage[] = [];
  const cobblestoneImg = await loadImage(cobblestoneUrl);
  const grassImg = await loadImage(grassUrl);
  const dryGrassImg = await loadImage(dryGrassUrl);
  const stoneImg = await loadImage(stoneUrl);
  const wallImg = await loadImage(wallUrl);
  const aguaImg = await loadImage(aguaUrl);
  const flowerImg = await loadImage(flowerUrl);
  const stoneGrass1 = await loadImage(stoneGrass1Url);
  const stoneGrass2 = await loadImage(stoneGrass2Url);
  const stoneDry1 = await loadImage(stoneDry1Url);
  const stoneDry2 = await loadImage(stoneDry2Url);

  const grasses = [
    grassImg,
    grassImg,
    grassImg,
    grassImg,
    grassImg,
    grassImg,
    grassImg,
    grassImg,
    grassImg,
    grassImg,
    grassImg,
    grassImg,
    grassImg,
    grassImg,
    grassImg,
    grassImg,
    grassImg,
    grassImg,
    grassImg,
    grassImg,
    grassImg,
    grassImg,
    grassImg,
    grassImg,
    grassImg,
    grassImg,
    grassImg,
    grassImg,
    grassImg,
    grassImg,
    grassImg,
    stoneGrass1,
    stoneGrass2,
    flowerImg
  ];

  const dries = [
    dryGrassImg,
    dryGrassImg,
    dryGrassImg,
    dryGrassImg,
    dryGrassImg,
    dryGrassImg,
    dryGrassImg,
    dryGrassImg,
    dryGrassImg,
    dryGrassImg,
    dryGrassImg,
    dryGrassImg,
    dryGrassImg,
    dryGrassImg,
    dryGrassImg,
    dryGrassImg,
    dryGrassImg,
    dryGrassImg,
    dryGrassImg,
    dryGrassImg,
    dryGrassImg,
    dryGrassImg,
    dryGrassImg,
    dryGrassImg,
    dryGrassImg,
    dryGrassImg,
    dryGrassImg,
    dryGrassImg,
    dryGrassImg,
    dryGrassImg,
    dryGrassImg,
    stoneDry1,
    stoneDry2,
  ];

  const pebbles = [
    stoneGrass1,
    stoneGrass2
  ];

  for (let y = 0; y < tileMap.length; y++) {
    for (let x = 0; x < tileMap[y].length; x++) {
      switch (tileMap[y][x]) {
        case "c":
          drawables.push(
            new DrawableImage(
              x * TILE_SIZE + TILE_SIZE / 2,
              y * TILE_SIZE + TILE_SIZE / 2,
              TILE_SIZE + 1,
              TILE_SIZE + 1,
              cobblestoneImg
            )
          );
          break;
        case " ":
          if (bg) {
            drawables.push(
              new DrawableImage(
                x * TILE_SIZE + TILE_SIZE / 2,
                y * TILE_SIZE + TILE_SIZE / 2,
                TILE_SIZE + 1,
                TILE_SIZE + 1,
                grasses[Math.floor(Math.random() * grasses.length)],
              Math.floor(Math.random() * 4) * Math.PI / 2
              )
            );
          }
          break;
        case "g":
          drawables.push(
            new DrawableImage(
              x * TILE_SIZE + TILE_SIZE / 2,
              y * TILE_SIZE + TILE_SIZE / 2,
              TILE_SIZE + 1,
              TILE_SIZE + 1,
              grassImg,
              Math.floor(Math.random() * 4) * Math.PI / 2
            )
          );
          break;
        case "p":
          drawables.push(
            new DrawableImage(
              x * TILE_SIZE + TILE_SIZE / 2,
              y * TILE_SIZE + TILE_SIZE / 2,
              TILE_SIZE + 1,
              TILE_SIZE + 1,
              pebbles[Math.floor(Math.random() * 2)],
              Math.floor(Math.random() * 4) * Math.PI / 2
            )
          );
          break;
        case "f":
          drawables.push(
            new DrawableImage(
              x * TILE_SIZE + TILE_SIZE / 2,
              y * TILE_SIZE + TILE_SIZE / 2,
              TILE_SIZE + 1,
              TILE_SIZE + 1,
              flowerImg,
              Math.floor(Math.random() * 4) * Math.PI / 2
            )
          );
          break;
        case "d":
          drawables.push(
            new DrawableImage(
              x * TILE_SIZE + TILE_SIZE / 2,
              y * TILE_SIZE + TILE_SIZE / 2,
              TILE_SIZE + 1,
              TILE_SIZE + 1,
              dries[Math.floor(Math.random() * dries.length)],
            )
          );
          break;
        case "s":
          drawables.push(
            new DrawableImage(
              x * TILE_SIZE + TILE_SIZE / 2,
              y * TILE_SIZE + TILE_SIZE / 2,
              TILE_SIZE + 1,
              TILE_SIZE + 1,
              stoneImg
            )
          );
          break;
        case "w":
          drawables.push(
            new DrawableImage(
              x * TILE_SIZE + TILE_SIZE / 2,
              y * TILE_SIZE + TILE_SIZE / 2,
              TILE_SIZE + 1,
              TILE_SIZE + 1,
              wallImg
            )
          );
          break;
        case "a":
          drawables.push(
            new DrawableImage(
              x * TILE_SIZE + TILE_SIZE / 2,
              y * TILE_SIZE + TILE_SIZE / 2,
              TILE_SIZE + 1,
              TILE_SIZE + 1,
              aguaImg
            )
          );
          break;
      }
    }
  }

  if (bg) {
    for (let i = -3; i < 36; i++) {
      for (let j = 1; j < 4; j++) {
        drawables.push(
          new DrawableImage(
            i * TILE_SIZE + TILE_SIZE / 2,
            -j * TILE_SIZE + TILE_SIZE / 2,
            TILE_SIZE + 1,
            TILE_SIZE + 1,
            wallImg
          )
        );
        drawables.push(
          new DrawableImage(
            i * TILE_SIZE + TILE_SIZE / 2,
            (32 + j) * TILE_SIZE + TILE_SIZE / 2,
            TILE_SIZE + 1,
            TILE_SIZE + 1,
            wallImg
          )
        );
        drawables.push(
          new DrawableImage(
            -j * TILE_SIZE + TILE_SIZE / 2,
            i * TILE_SIZE + TILE_SIZE / 2,
            TILE_SIZE + 1,
            TILE_SIZE + 1,
            wallImg
          )
        );
        drawables.push(
          new DrawableImage(
            (32 + j) * TILE_SIZE + TILE_SIZE / 2,
            i * TILE_SIZE + TILE_SIZE / 2,
            TILE_SIZE + 1,
            TILE_SIZE + 1,
            wallImg
          )
        );
      }
    }
  }

  return drawables;
};
