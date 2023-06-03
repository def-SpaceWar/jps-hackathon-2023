export enum RenderState {
  SUCCESS,
  QUIT,
};

export const renderLoop = (callback: (dt: number) => RenderState): Promise<null> => {
  return new Promise((resolve) => {
    const transformedCallback = (before: number) => (now: number) => {
      const dt = (now - before) / 1000;
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
