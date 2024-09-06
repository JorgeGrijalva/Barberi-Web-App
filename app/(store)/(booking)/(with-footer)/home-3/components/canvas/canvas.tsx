"use client";

import React, { useRef, useEffect } from "react";
// eslint-disable-next-line import/extensions
import { Gradient } from "./gradient";

export const Canvas = () => {
  const canvasRef = useRef(null);
  const gradient = new Gradient();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    gradient.initGradient("#gradient-canvas");
  }, []);

  return <canvas id="gradient-canvas" className="absolute" ref={canvasRef} data-transition-in />;
};
