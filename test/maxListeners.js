import EmitterFactory from './EmitterFactory';
import EventAggregator from '../src/index';

describe('EventAggregator#maxListeners', () => {
  it('emits a warning when too many listeners are attached', (done) => {
    const triggers = EmitterFactory.create(4);
    const aggregator = new EventAggregator(triggers);

    const eventSpy = sinon.spy();
    const warningSpy = sinon.spy();

    process.on('warning', warningSpy);

    aggregator.setMaxListeners(1);

    aggregator.onAny('alpha', eventSpy);
    aggregator.onAny('alpha', () => {});

    tick()
      .then(() => {
        expect(warningSpy).to.have.been.calledOnce();
        aggregator.onAny('alpha', () => {});
        return tick();
      })
      .then(() => {
        expect(warningSpy).to.have.been.calledOnce();
        aggregator.onAny('beta', eventSpy);
        aggregator.onAny('beta', () => {});
        return tick();
      })
      .then(() => {
        done();
      });
  });

  it('resets the warning if maxListeners is changed', (done) => {
    EmitterFactory.reset();
    const triggers = EmitterFactory.create(4);
    const aggregator = new EventAggregator(triggers);

    const eventSpy = sinon.spy();
    const warningSpy = sinon.spy();

    process.on('warning', warningSpy);

    aggregator.setMaxListeners(1);

    aggregator.onAny('alpha', eventSpy);
    aggregator.onAny('alpha', () => {});

    tick()
      .then(() => {
        expect(warningSpy).to.have.been.calledOnce();
        aggregator.onAny('alpha', () => {});
        return tick();
      })
      .then(() => {
        expect(warningSpy).to.have.been.calledOnce();
        aggregator.setMaxListeners(2);
        aggregator.onAny('beta', eventSpy);
        aggregator.onAny('beta', () => {});
        aggregator.onAny('beta', () => {});
        return tick();
      })
      .then(() => {
        expect(warningSpy).to.have.been.calledTwice();
        done();
      });
  });
});
