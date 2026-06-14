import {
  Scene,
  Mesh,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Vector3,
  ArcRotateCamera,
} from "@babylonjs/core";
import type { InputManager } from "../input/InputManager";

const SPEED = 0.1;

export class Player {
  readonly mesh: Mesh;

  constructor(scene: Scene) {
    this.mesh = MeshBuilder.CreateBox(
      "player",
      { width: 1, height: 2, depth: 1 },
      scene,
    );
    this.mesh.position.y = 1;

    const mat = new StandardMaterial("playerMat", scene);
    mat.diffuseColor = new Color3(0.6, 0.4, 0.8);
    this.mesh.material = mat;
  }

  update(input: InputManager, camera: ArcRotateCamera): void {
    const forward = camera.getForwardRay().direction;
    const forwardFlat = new Vector3(forward.x, 0, forward.z).normalize();
    const right = Vector3.Cross(Vector3.Up(), forwardFlat).normalize();

    const move = Vector3.Zero();

    if (input.isDown("w") || input.isDown("arrowup"))
      move.addInPlace(forwardFlat);
    if (input.isDown("s") || input.isDown("arrowdown"))
      move.subtractInPlace(forwardFlat);
    if (input.isDown("a") || input.isDown("arrowleft"))
      move.subtractInPlace(right);
    if (input.isDown("d") || input.isDown("arrowright")) move.addInPlace(right);

    if (move.length() > 0) {
      move.normalize().scaleInPlace(SPEED);
      this.mesh.position.addInPlace(move);
    }
  }
}
