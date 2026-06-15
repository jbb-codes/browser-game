import {
  Engine,
  Scene,
  Vector3,
  MeshBuilder,
  StandardMaterial,
  Color3,
  HavokPlugin,
  PhysicsAggregate,
  PhysicsShapeType,
} from "@babylonjs/core";
import { createLighting } from "./createLighting";

export function createScene(engine: Engine, havokPlugin: HavokPlugin): Scene {
  const scene = new Scene(engine);
  scene.enablePhysics(new Vector3(0, -9.81, 0), havokPlugin);

  createLighting(scene);

  const ground = MeshBuilder.CreateGround(
    "ground",
    { width: 40, height: 40 },
    scene,
  );
  const groundMat = new StandardMaterial("groundMat", scene);
  groundMat.diffuseColor = new Color3(0.3, 0.6, 0.2);
  ground.material = groundMat;
  new PhysicsAggregate(ground, PhysicsShapeType.MESH, { mass: 0 }, scene);

  return scene;
}
