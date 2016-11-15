import TestEmitter from './TestEmitter';

let counter = 0;

class EmitterFactory {
  static create(emittersRequested = 1) {
    const emitters = [];
    let emittersCreated = 0;

    while (emittersCreated < emittersRequested) {
      emitters.push(new TestEmitter(counter));
      emittersCreated += 1;
      counter += 1;
    }

    return emitters;
  }

  static reset() {
    counter = 0;
  }
}

export default EmitterFactory;
