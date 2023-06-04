export enum RenderState {
  SUCCESS,
  QUIT,
};

export const renderLoop = (callback: (dt: number) => RenderState): Promise<null> => {
  return new Promise((resolve) => {
    const transformedCallback = (before: number) => (now: number) => {
      let dt = (now - before) / 1000;
      if (dt > 0.5) dt = 0.5;
      const result = callback(dt);

      switch (result) {
        case RenderState.SUCCESS:
          requestAnimationFrame(transformedCallback(now));
          break;
        case RenderState.QUIT:
          resolve(null);
          break;
      }
    };

    requestAnimationFrame(transformedCallback(performance.now()));
  });
};
