import { Engine } from "@babylonjs/core";
import { Game } from "./game/Game";

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine = new Engine(canvas, true);

(async () => {
  const game = await Game.create(engine, canvas);
  engine.runRenderLoop(() => game.render());
  window.addEventListener("resize", () => engine.resize());
})();
