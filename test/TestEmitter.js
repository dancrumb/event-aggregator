import { EventEmitter } from 'events';

class TestEmitter extends EventEmitter {
  constructor(value) {
    super();
    this.value = value;
  }

  alpha() {
    this.emit('alpha', this.value);
  }

  beta() {
    this.emit('beta', this.value);
  }

  gamma() {
    this.emit('gamma', this.value);
  }
}

export default TestEmitter;
