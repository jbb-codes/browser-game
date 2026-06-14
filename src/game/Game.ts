import { Engine, Scene } from "@babylonjs/core";
import { createScene } from "../scene/createScene";
import { Player } from "../entities/Player";
import { GameCamera } from "../camera/GameCamera";
import { InputManager } from "../input/InputManager";

export class Game {
  readonly scene: Scene;
  private readonly player: Player;
  private readonly gameCamera: GameCamera;
  private readonly input: InputManager;

  constructor(engine: Engine, canvas: HTMLCanvasElement) {
    this.scene = createScene(engine);
    this.input = new InputManager();
    this.player = new Player(this.scene);
    this.gameCamera = new GameCamera(this.scene, canvas, this.player.mesh);

    this.scene.onBeforeRenderObservable.add(() => this.update());
  }

  private update(): void {
    this.player.update(this.input, this.gameCamera.camera);
  }

  render(): void {
    this.scene.render();
  }

  dispose(): void {
    this.input.dispose();
    this.scene.dispose();
  }
}
