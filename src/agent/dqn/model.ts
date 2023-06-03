import { layers, Sequential } from "@tensorflow/tfjs";

export const makeModel = (stateSize: number, actionSize: number): Sequential => {
    const model = new Sequential({
        layers: [
            layers.dense({
                units: 16,
                inputShape: [stateSize],
                activation: 'relu'
            }),
            layers.dense({
                units: actionSize,
                activation: 'linear'
            })
        ]
    });

    model.compile({
        optimizer: 'adam',
        loss: 'meanSquaredError'
    });

    model.summary();

    return model;
};
