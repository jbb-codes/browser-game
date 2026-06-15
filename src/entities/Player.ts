import {
  Scene,
  Mesh,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Vector3,
  ArcRotateCamera,
  PhysicsCharacterController,
  CharacterSupportedState,
} from "@babylonjs/core";
import type { InputManager } from "../input/InputManager";

const SPEED = 5;
const JUMP_FORCE = 6;
const GRAVITY = new Vector3(0, -18, 0);
const DOWN = new Vector3(0, -1, 0);

export class Player {
  readonly mesh: Mesh;
  private readonly characterController: PhysicsCharacterController;
  private verticalVelocity = 0;

  constructor(scene: Scene) {
    this.mesh = MeshBuilder.CreateBox(
      "player",
      { width: 1, height: 2, depth: 1 },
      scene,
    );
    const mat = new StandardMaterial("playerMat", scene);
    mat.diffuseColor = new Color3(0.6, 0.4, 0.8);
    this.mesh.material = mat;

    this.characterController = new PhysicsCharacterController(
      new Vector3(0, 1, 0),
      { capsuleHeight: 2, capsuleRadius: 0.5 },
      scene,
    );
  }

  update(input: InputManager, camera: ArcRotateCamera, delta: number): void {
    const support = this.characterController.checkSupport(delta, DOWN);
    const isGrounded =
      support.supportedState === CharacterSupportedState.SUPPORTED;

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

    const horizontal =
      move.length() > 0 ? move.normalize().scale(SPEED) : Vector3.Zero();

    if (isGrounded) {
      this.verticalVelocity = 0;
      if (input.isDown(" ")) {
        this.verticalVelocity = JUMP_FORCE;
      }
    } else {
      this.verticalVelocity += GRAVITY.y * delta;
    }

    const velocity = new Vector3(
      horizontal.x,
      this.verticalVelocity,
      horizontal.z,
    );
    this.characterController.setVelocity(velocity);
    this.characterController.integrate(delta, support, GRAVITY);

    this.mesh.position.copyFrom(this.characterController.getPosition());
  }
}
