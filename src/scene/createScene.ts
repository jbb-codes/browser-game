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
  ShadowGenerator,
} from "@babylonjs/core";
import { createLighting } from "./createLighting";

const TERRAIN_SIZE = 200;
const TERRAIN_MAX_HEIGHT = 20;
const TERRAIN_SUBDIVISIONS = 150;
const FOG_DENSITY = 0.006;
const FOG_COLOR = new Color3(0.74, 0.84, 0.95);

function addTerrain(scene: Scene): Promise<void> {
  return new Promise((resolve) => {
    MeshBuilder.CreateGroundFromHeightMap(
      "terrain",
      "/textures/heightmap.png",
      {
        width: TERRAIN_SIZE,
        height: TERRAIN_SIZE,
        subdivisions: TERRAIN_SUBDIVISIONS,
        minHeight: 0,
        maxHeight: TERRAIN_MAX_HEIGHT,
        onReady: (mesh) => {
          const material = new StandardMaterial("terrainMaterial", scene);
          material.diffuseColor = new Color3(0.3, 0.6, 0.2);
          material.specularColor = Color3.Black();
          mesh.material = material;
          mesh.receiveShadows = true;
          new PhysicsAggregate(mesh, PhysicsShapeType.MESH, { mass: 0 }, scene);
          resolve();
        },
      },
      scene,
    );
  });
}

export async function createScene(
  engine: Engine,
  havokPlugin: HavokPlugin,
): Promise<{ scene: Scene; shadowGenerator: ShadowGenerator }> {
  const scene = new Scene(engine);
  scene.enablePhysics(new Vector3(0, -9.81, 0), havokPlugin);

  scene.fogMode = Scene.FOGMODE_EXP2;
  scene.fogColor = FOG_COLOR;
  scene.fogDensity = FOG_DENSITY;

  const { shadowGenerator } = createLighting(scene);
  await addTerrain(scene);

  return { scene, shadowGenerator };
}
