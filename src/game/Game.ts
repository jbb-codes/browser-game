import HavokPhysics from "@babylonjs/havok";
import { Engine, HavokPlugin, Scene } from "@babylonjs/core";
import { createScene } from "../scene/createScene";
import { Player } from "../entities/Player";
import { GameCamera } from "../camera/GameCamera";
import { InputManager } from "../input/InputManager";

export class Game {
  readonly scene: Scene;
  private readonly player: Player;
  private readonly gameCamera: GameCamera;
  private readonly input: InputManager;

  static async create(
    engine: Engine,
    canvas: HTMLCanvasElement,
  ): Promise<Game> {
    const havok = await HavokPhysics();
    const havokPlugin = new HavokPlugin(true, havok);
    return new Game(engine, canvas, havokPlugin);
  }

  private constructor(
    engine: Engine,
    canvas: HTMLCanvasElement,
    havokPlugin: HavokPlugin,
  ) {
    this.scene = createScene(engine, havokPlugin);
    this.input = new InputManager();
    this.player = new Player(this.scene);
    this.gameCamera = new GameCamera(this.scene, canvas, this.player.mesh);

    this.scene.onBeforeRenderObservable.add(() => this.update());
  }

  private update(): void {
    const delta = this.scene.getEngine().getDeltaTime() / 1000;
    this.player.update(this.input, this.gameCamera.camera, delta);
  }

  render(): void {
    this.scene.render();
  }

  dispose(): void {
    this.input.dispose();
    this.scene.dispose();
  }
}
