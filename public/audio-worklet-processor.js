class ChunkProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    const opts = options.processorOptions || {};
    const sampleRate = opts.sampleRate || 16000;
    const chunkDurationMs = opts.chunkDurationMs || 250;
    this.chunkSamples = Math.max(1, Math.round((sampleRate * chunkDurationMs) / 1000));
    this.buffer = new Float32Array(this.chunkSamples);
    this.offset = 0;
  }

  process(inputs) {
    const input = inputs[0] && inputs[0][0];
    if (!input) return true;

    for (let i = 0; i < input.length; i++) {
      this.buffer[this.offset++] = input[i];
      if (this.offset >= this.chunkSamples) {
        const copy = new Float32Array(this.chunkSamples);
        copy.set(this.buffer);
        this.port.postMessage({ type: "chunk", buffer: copy.buffer }, [copy.buffer]);
        this.offset = 0;
      }
    }
    return true;
  }
}

registerProcessor("chunk-processor", ChunkProcessor);
