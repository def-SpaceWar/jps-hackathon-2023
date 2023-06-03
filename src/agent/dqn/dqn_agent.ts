import { tensor, type Rank, type LayersModel, type Tensor } from "@tensorflow/tfjs";

type Experience = {
    prev: Tensor<Rank>;
    action: number;
    reward: number;
    next: Tensor<Rank>;
};

type Memory = Experience[];

export class DQNAgent {
    decay = 0.001;
    expProb = 1;
    action = -1;
    memory: Memory = [];

    constructor(
        public model: LayersModel,
        public gamma = 0.99,
        public lr = 0.001,
        public actionSize = 4,
        public batchSize = 8,
        public maxMemorySize = 9
    ) { }

    updateExploreProb(): void {
        this.expProb = this.expProb * Math.exp(-this.decay);
    }

    async predictMove(state: Tensor<Rank>): Promise<number> {
        if (this.expProb > Math.random()) {
            this.action = Math.floor(Math.random() * this.actionSize);
        } else {
            const result = await ((this.model.predict(state, {}) as Tensor<Rank>).array() as Promise<number[][]>);
            this.action = result[0].reduce((p, rN, n) => (result[0][p] < rN) ? n : p, 0);
        }

        return this.action;
    }

    storeData(prev: Tensor<Rank>, action: number, reward: number, next: Tensor<Rank>): void {
        this.memory.push({
            prev,
            action,
            reward,
            next
        });

        if (this.memory.length > this.maxMemorySize) this.memory.shift();
    }

    shuffleMemory(): void {
        for (let i = this.memory.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = this.memory[i];
            this.memory[i] = this.memory[j];
            this.memory[j] = temp;
        }
    }

    async train() {
        this.shuffleMemory();
        const sample = this.memory.slice(0, this.batchSize);
        for (let i = 0; i < sample.length; i++) {
            const experience = sample[i];
            let currentQ = this.model.predict(experience.prev, {}) as Tensor<Rank>;
            const target = experience.reward;
            const nextQ = this.model.predict(experience.next, {}) as Tensor<Rank>;
            const nextQToArray = await (nextQ.array() as Promise<number[][]>);
            nextQToArray[0].map(q => q * this.gamma)
            const qToArray = await (currentQ.array() as Promise<number[][]>);
            qToArray[0].map((v, idx) => v + nextQToArray[0][idx])
            qToArray[0][experience.action] = target;
            await this.model.fit(experience.next, tensor(qToArray), {
                epochs: 1,
                verbose: 0
            });
        }
    }

    save(uri: string) {
        this.model.save(uri);
    }
}
