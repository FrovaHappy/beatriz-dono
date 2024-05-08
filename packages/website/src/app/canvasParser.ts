"use Client";
import { Canvas } from "@/types/Canvas.types";

export function addIdOfLayers(canvas: Partial<Canvas>) {
  const layers = canvas.layers!.map((l) => {
    return { ...l, id: l.id ?? Math.round(Math.random() * 1000) };
  });
  canvas.layers = layers;
  return canvas as Canvas;
}

export function deleteIdOfLayers(canvas: Canvas) {
  const { layers, ...c } = canvas;
  const layersWithoutId = layers.map((l) => {
    const { id, ...rest } = l;
    return rest;
  });
  return { ...c, layers: layersWithoutId };
}
