/*
 * Removes `value` from `array`, assuming it exists.
 *
 * It will only remove the first instance of `value`. It returns the index (of the original array)
 * that was removed. Therefore, callers can check for `-1` to see if nothing as removed.
 */
function removeFromArray(array, value) {
  const index = array.indexOf(value);

  if (index >= 0) {
    array.splice(index, 1);
  }

  return index;
}

function addHandler(eventName, threshold, frequency, listener) {
  if (!this.listeners[eventName]) {
    this.listeners[eventName] = [];
  }

  const handler = {
    threshold,
    frequency,
    fn: listener,
    eventArgs: new Array(this.emitters.length).fill(null),
  };

  this.listeners[eventName].push(handler);
}

function clearFiredEvents(listener) {
  listener.eventArgs.fill(null);
}

function getMasterListener(eventName) {
  const aggregator = this;

  if (!this.masterListeners[eventName]) {
    this.masterListeners[eventName] = function masterListener(...eventArguments) {
      const sourceEmitter = this;
      const listeners = aggregator.listeners[eventName];

      const emitterIndex = aggregator.emitters.indexOf(sourceEmitter);
      if (emitterIndex < 0) {
        throw new Error('Somehow called the listener with an emitter that we are not aggregating');
      }

      aggregator.listeners[eventName] = listeners.filter((listener) => {
        listener.eventArgs[emitterIndex] = Array.prototype.slice.call(eventArguments);

        const allFired = (listener.eventArgs.indexOf(null) < 0);
        const waitForAll = (listener.threshold === 'all');

        const callListener = allFired || !waitForAll;

        if (callListener) {
          if (waitForAll) {
            listener.fn.call(aggregator, listener.eventArgs.slice());
            clearFiredEvents(listener);
          } else {
            listener.fn.call(aggregator, sourceEmitter, eventArguments);
            clearFiredEvents(listener);
          }
        }

        return !(callListener && (listener.frequency === 'once'));
      });
    };
  }

  return this.masterListeners[eventName];
}

function attachMasterListener(eventName) {
  const masterListener = getMasterListener.call(this, eventName);
  if (!(eventName in this.listeners)) {
    this.emitters.forEach(emitter => emitter.on(eventName, masterListener));
  }
}

/**
 * The EventAggregator provides a way to bring EventEmitters together into a group and to interact
 * with them as a collection (rather than individuals)
 */
class EventAggregator {
  /**
   * When instantiating an aggregator, you can pass it a single EventEmitter, a collection of
   * Emitters or nothing.
   * @param {Array<EventEmitter>|EventEmitter} [emitters]
   */
  constructor(emitters = []) {
    if (!Array.isArray(emitters)) {
      this.emitters = [emitters];
    } else {
      this.emitters = emitters;
    }

    this.listeners = {};
    this.masterListeners = {};
  }

  /**
   * Provides a list of the events that the aggregator is listening for.
   *
   * NB: This doesn't mean that there are necessarily any handlers attached to these events.
   * @returns {Array<string>}
   */
  eventsListenedTo() {
    return Object.keys(this.listeners);
  }

  /**
   * Add an emitter to the group.
   *
   * Any listeners that are currently defined will be automatically added to this emitter.
   * @param {EventEmitter} emitter
   */
  addEmitter(emitter) {
    this.emitters.push(emitter);
    Object.keys(this.listeners).forEach((eventName) => {
      emitter.on(eventName, getMasterListener.call(this, eventName));
    });
  }

  /**
   * Removers an emitter from the group.
   *
   * Any listeners attached to this emitter are also removed.
   *
   * If any listeners are attached via onAll or onceAll, then removing this emitter may result in
   * those listeners being fired. This will happen if the emitter that is being removed is the only
   * one in the group that hadn't fired.
   *
   * Put another way, if *all* of the emitters except this one had fired, then removing this one
   * fires the `onAll` and `onceAll` listeners.
   * @param {EventEmitter} emitter
   */
  removeEmitter(emitter) {
    const removedIndex = removeFromArray(this.emitters, emitter);

    this.eventsListenedTo().forEach((eventName) => {
      emitter.removeListener(eventName, getMasterListener.call(this, eventName));
      this.listeners[eventName].forEach((listener) => {
        listener.eventArgs.splice(removedIndex, 1);
        const allFired = (listener.eventArgs.indexOf(null) < 0) && listener.eventArgs.length > 0;

        if (allFired) {
          listener.fn.call(this, listener.eventArgs.slice());
          clearFiredEvents(listener);
        }
      });
    });
  }

  /**
   * Removes a listener from the aggregator (just like EventEmitter#removeListener)
   *
   * @param {string} eventName The name of the event from which we're removing a listener
   * @param {function} listenerToRemove The listener that we wish to remove
   */
  removeListener(eventName, listenerToRemove) {
    const listeners = this.listeners[eventName] || [];

    this.listeners[eventName] = listeners.filter(listener => listener.fn !== listenerToRemove);
  }

  /**
   *
   * @param {string} eventName
   * @param {function} listener
   */
  onAny(eventName, listener) {
    attachMasterListener.call(this, eventName);
    addHandler.call(this, eventName, 'any', 'on', listener);
  }

  /**
   *
   * @param {string} eventName
   * @param {function} listener
   */
  onAll(eventName, listener) {
    attachMasterListener.call(this, eventName);
    addHandler.call(this, eventName, 'all', 'on', listener);
  }

  /**
   *
   * @param {string} eventName
   * @param {function} listener
   */
  onceAny(eventName, listener) {
    attachMasterListener.call(this, eventName);
    addHandler.call(this, eventName, 'any', 'once', listener);
  }

  /**
   *
   * @param {string} eventName
   * @param {function} listener
   */
  onceAll(eventName, listener) {
    attachMasterListener.call(this, eventName);
    addHandler.call(this, eventName, 'all', 'once', listener);
  }

  /**
   * @param {string} [eventName]
   */
  reset(eventName) {
    if (eventName) {
      this.listeners[eventName].forEach(clearFiredEvents);
    } else {
      Object.keys(this.listeners).forEach((name) => {
        this.reset(name);
      });
    }
  }

  /**
   *
   */
  destroy() {
    this.emitters.forEach(this.removeEmitter.bind(this));
    this.listeners = null;
  }
}

export default EventAggregator;
