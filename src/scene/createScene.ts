import {
  Engine,
  Scene,
  HemisphericLight,
  DirectionalLight,
  Vector3,
  MeshBuilder,
  StandardMaterial,
  Color3,
  HavokPlugin,
  PhysicsAggregate,
  PhysicsShapeType,
} from "@babylonjs/core";

export function createScene(engine: Engine, havokPlugin: HavokPlugin): Scene {
  const scene = new Scene(engine);
  scene.enablePhysics(new Vector3(0, -9.81, 0), havokPlugin);

  new HemisphericLight("ambientLight", new Vector3(0, 1, 0), scene).intensity =
    0.6;

  const sun = new DirectionalLight("sun", new Vector3(-1, -2, -1), scene);
  sun.intensity = 0.8;

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
