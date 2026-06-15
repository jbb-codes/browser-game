import {
  Scene,
  DefaultRenderingPipeline,
  ColorCurves,
  Camera,
} from "@babylonjs/core";

export function createPostProcessing(scene: Scene, camera: Camera): void {
  const pipeline = new DefaultRenderingPipeline("default", true, scene, [
    camera,
  ]);

  pipeline.bloomEnabled = true;
  pipeline.bloomKernel = 64;
  pipeline.bloomThreshold = 0.8;
  pipeline.bloomWeight = 0.15;
  pipeline.bloomScale = 0.5;

  pipeline.imageProcessingEnabled = true;
  pipeline.imageProcessing.colorCurvesEnabled = true;

  const curves = new ColorCurves();
  curves.globalSaturation = 20;
  curves.midtonesHue = 25;
  curves.midtonesExposure = 5;

  pipeline.imageProcessing.colorCurves = curves;
}
