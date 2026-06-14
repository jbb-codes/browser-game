import { Scene, ArcRotateCamera, Mesh } from "@babylonjs/core";

export class GameCamera {
  readonly camera: ArcRotateCamera;

  constructor(scene: Scene, _canvas: HTMLCanvasElement, target: Mesh) {
    this.camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 3,
      20,
      target.position.clone(),
      scene,
    );
    this.camera.lowerRadiusLimit = 5;
    this.camera.upperRadiusLimit = 40;
    this.camera.upperBetaLimit = Math.PI / 2.5;

    scene.onBeforeRenderObservable.add(() => {
      this.camera.target = target.position.clone();
    });
  }
}
