import { AbstractMesh, ArcRotateCamera, Scene, Vector3 } from "@babylonjs/core";

export class GameCamera {
  readonly camera: ArcRotateCamera;

  constructor(scene: Scene, canvas: HTMLCanvasElement, target: AbstractMesh) {
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
    this.camera.panningSensibility = 0;

    this.camera.attachControl(canvas, true);
  }

  follow(position: Vector3): void {
    this.camera.target.copyFrom(position);
  }
}
