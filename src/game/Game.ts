import HavokPhysics from "@babylonjs/havok";
import { Engine, HavokPlugin, Scene, ShadowGenerator } from "@babylonjs/core";
import { createScene } from "../scene/createScene";
import { createPostProcessing } from "../scene/createPostProcessing";
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
    const { scene, shadowGenerator } = createScene(engine, havokPlugin);
    const player = await Player.create(scene);
    return new Game(canvas, scene, shadowGenerator, player);
  }

  private constructor(
    canvas: HTMLCanvasElement,
    scene: Scene,
    shadowGenerator: ShadowGenerator,
    player: Player,
  ) {
    this.scene = scene;
    this.input = new InputManager();
    this.player = player;
    shadowGenerator.addShadowCaster(this.player.root, true);
    this.gameCamera = new GameCamera(this.scene, canvas, this.player.root);
    createPostProcessing(this.scene, this.gameCamera.camera);

    this.scene.onBeforeRenderObservable.add(() => this.update());
  }

  private update(): void {
    const delta = this.scene.getEngine().getDeltaTime() / 1000;
    this.player.update(this.input, this.gameCamera.camera, delta);
    this.gameCamera.follow(this.player.cameraTarget);
  }

  render(): void {
    this.scene.render();
  }

  dispose(): void {
    this.input.dispose();
    this.scene.dispose();
  }
}
