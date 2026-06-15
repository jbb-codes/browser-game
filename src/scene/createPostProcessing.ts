import {
  Scene,
  DefaultRenderingPipeline,
  ColorCurves,
  Camera,
  SSAO2RenderingPipeline,
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

  const ssao = new SSAO2RenderingPipeline("ssao", scene, 0.75, [camera]);
  ssao.radius = 2;
  ssao.samples = 16;
  ssao.totalStrength = 1.2;
  ssao.base = 0.1;
}
