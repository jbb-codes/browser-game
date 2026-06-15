import {
  Scene,
  DirectionalLight,
  HemisphericLight,
  Vector3,
  Color3,
  MeshBuilder,
} from "@babylonjs/core";
import { SkyMaterial } from "@babylonjs/materials";

const SUN_DIRECTION = new Vector3(-1, -2, -1);

export function createLighting(scene: Scene): { sun: DirectionalLight } {
  const sun = new DirectionalLight("sun", SUN_DIRECTION, scene);
  sun.intensity = 1.3;
  sun.diffuse = new Color3(1.0, 0.95, 0.8);

  const fill = new HemisphericLight("fillLight", new Vector3(0, 1, 0), scene);
  fill.intensity = 0.3;
  fill.diffuse = new Color3(0.6, 0.75, 1.0);

  const skyMat = new SkyMaterial("skyMat", scene);
  skyMat.backFaceCulling = false;
  skyMat.sunPosition = SUN_DIRECTION.negate();

  const skybox = MeshBuilder.CreateBox("skybox", { size: 1000 }, scene);
  skybox.material = skyMat;

  return { sun };
}
