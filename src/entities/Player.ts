import {
  Scene,
  AbstractMesh,
  Vector3,
  ArcRotateCamera,
  PhysicsCharacterController,
  CharacterSupportedState,
  ImportMeshAsync,
  AnimationGroup,
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import type { InputManager } from "../input/InputManager";

const SPEED = 5;
const JUMP_FORCE = 6;
const GRAVITY = new Vector3(0, -18, 0);
const DOWN = new Vector3(0, -1, 0);
const CAPSULE_HEIGHT = 2;
const CAPSULE_RADIUS = 0.5;
const ROTATION_SPEED = 10;
const CHARACTER_URL = "https://assets.babylonjs.com/meshes/HVGirl.glb";
const CHARACTER_SCALE = 0.2;
const CAMERA_TARGET_HEIGHT = 3;

export class Player {
  readonly root: AbstractMesh;
  private readonly characterController: PhysicsCharacterController;
  private verticalVelocity = 0;
  private isMoving = false;
  private readonly idleAnim: AnimationGroup | undefined;
  private readonly walkAnim: AnimationGroup | undefined;

  static async create(scene: Scene): Promise<Player> {
    const { meshes, animationGroups } = await ImportMeshAsync(
      CHARACTER_URL,
      scene,
    );
    return new Player(scene, meshes[0], animationGroups);
  }

  private constructor(
    scene: Scene,
    root: AbstractMesh,
    animationGroups: AnimationGroup[],
  ) {
    this.root = root;
    this.root.scaling.setAll(CHARACTER_SCALE);
    this.root.rotationQuaternion = null;
    animationGroups.forEach((ag) => ag.stop());
    this.idleAnim = animationGroups.find((ag) => ag.name === "Idle");
    this.walkAnim = animationGroups.find((ag) => ag.name === "Walking");
    this.idleAnim?.start(true);

    this.characterController = new PhysicsCharacterController(
      new Vector3(0, 1, 0),
      { capsuleHeight: CAPSULE_HEIGHT, capsuleRadius: CAPSULE_RADIUS },
      scene,
    );
  }

  get cameraTarget(): Vector3 {
    return this.root.position.add(new Vector3(0, CAMERA_TARGET_HEIGHT, 0));
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

    const isMovingNow = move.length() > 0;
    const horizontal = isMovingNow
      ? move.normalize().scale(SPEED)
      : Vector3.Zero();

    if (isMovingNow) {
      const targetAngle = Math.atan2(horizontal.x, horizontal.z);
      const currentAngle = this.root.rotation.y;
      const diff =
        ((targetAngle - currentAngle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      this.root.rotation.y += diff * Math.min(ROTATION_SPEED * delta, 1);
    }

    if (isMovingNow !== this.isMoving) {
      this.isMoving = isMovingNow;
      if (isMovingNow) {
        this.idleAnim?.stop();
        this.walkAnim?.start(true);
      } else {
        this.walkAnim?.stop();
        this.idleAnim?.start(true);
      }
    }

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

    const pos = this.characterController.getPosition();
    this.root.position.set(pos.x, pos.y - CAPSULE_HEIGHT / 2, pos.z);
  }
}
