import {
  Scene,
  DirectionalLight,
  HemisphericLight,
  Vector3,
  Color3,
  MeshBuilder,
  ShadowGenerator,
} from "@babylonjs/core";
import { SkyMaterial } from "@babylonjs/materials";

const SUN_DIRECTION = new Vector3(-1, -2, -1);

export function createLighting(scene: Scene): {
  sun: DirectionalLight;
  shadowGenerator: ShadowGenerator;
} {
  const sun = new DirectionalLight("sun", SUN_DIRECTION, scene);
  sun.position = new Vector3(20, 40, 20);
  sun.intensity = 1.3;
  sun.diffuse = new Color3(1.0, 0.95, 0.8);

  const fill = new HemisphericLight("fillLight", new Vector3(0, 1, 0), scene);
  fill.intensity = 0.3;
  fill.diffuse = new Color3(0.6, 0.75, 1.0);

  const skyMat = new SkyMaterial("skyMat", scene);
  skyMat.backFaceCulling = false;
  skyMat.useSunPosition = true;
  skyMat.sunPosition = SUN_DIRECTION.negate().scale(100);
  skyMat.turbidity = 10;
  skyMat.rayleigh = 2;
  skyMat.mieCoefficient = 0.005;
  skyMat.mieDirectionalG = 0.999;

  const skybox = MeshBuilder.CreateBox("skybox", { size: 1000 }, scene);
  skybox.material = skyMat;
  skybox.infiniteDistance = true;

  const shadowGenerator = new ShadowGenerator(2048, sun);
  shadowGenerator.usePercentageCloserFiltering = true;
  shadowGenerator.filteringQuality = ShadowGenerator.QUALITY_HIGH;
  shadowGenerator.bias = 0;
  shadowGenerator.normalBias = 0;

  return { sun, shadowGenerator };
}
