import EmitterFactory from './EmitterFactory';
import EventAggregator from '../src/index';

describe('EventAggregator#onAll', () => {

  it('fires an event when all constituent events have fired', (done) => {
    EmitterFactory.reset();
    const triggers = EmitterFactory.create(4);
    const aggregator = new EventAggregator(triggers);

    const eventSpy = sinon.spy();

    aggregator.onAll('alpha', eventSpy);

    triggers[0].alpha();

    tick()
      .then(() => {
        expect(eventSpy).not.to.have.been.called;
        triggers[1].alpha();
        triggers[2].alpha();
        triggers[3].alpha();

        return tick();

      })
      .then(() => {
        expect(eventSpy).to.have.been.calledOnce;
        expect(eventSpy).to.have.been.calledWith([[0], [1], [2], [3]]);

        triggers[3].alpha();
        triggers[2].alpha();
        triggers[1].alpha();
        triggers[0].alpha();

        return tick();

      })
      .then(() => {
        expect(eventSpy).to.have.been.calledTwice;
        expect(eventSpy).to.have.been.calledWith([[0], [1], [2], [3]]);
        done()
      });
  });

  it('fires an event if the only emitter in the set that hasn\'t fired is removed', (done) => {
    EmitterFactory.reset();
    const triggers = EmitterFactory.create(4);
    const aggregator = new EventAggregator(triggers);

    const eventSpy = sinon.spy();

    aggregator.onAll('alpha', eventSpy);

    triggers[0].alpha();
    triggers[1].alpha();
    triggers[3].alpha();

    aggregator.removeEmitter(triggers[2]);

    process.nextTick(() => {
      expect(eventSpy).to.have.been.calledOnce;
      expect(eventSpy).to.have.been.calledWith([[0], [1], [3]]);
      done()
    });
  });

  it('does not fire an event if the last emitter is removed', (done) => {
    EmitterFactory.reset();
    const triggers = EmitterFactory.create(1);
    const aggregator = new EventAggregator(triggers);

    const eventSpy = sinon.spy();

    aggregator.onAll('alpha', eventSpy);

    aggregator.removeEmitter(triggers[0]);

    process.nextTick(() => {
      expect(eventSpy).not.to.have.been.called;
      done()
    });
  });

  it('can be reset so that previous catches are ignored', (done) => {
    EmitterFactory.reset();
    const triggers = EmitterFactory.create(4);
    const aggregator = new EventAggregator(triggers);

    const eventSpy = sinon.spy();

    aggregator.onAll('alpha', eventSpy);

    triggers[0].alpha();
    triggers[1].alpha();
    triggers[3].alpha();

    aggregator.reset();
    triggers[2].alpha();

    tick()
      .then(() => {
        expect(eventSpy).not.to.have.been.called;

        triggers[0].alpha();
        triggers[1].alpha();
        triggers[3].alpha();

        return tick();
      })
      .then(() => {
        expect(eventSpy).to.have.been.calledOnce;
        expect(eventSpy).to.have.been.calledWith([[0], [1], [2], [3]]);
        done()
      });
  });

  it('supports listeners being added and removed', (done) => {
    EmitterFactory.reset();
    const triggers = EmitterFactory.create(2);
    const aggregator = new EventAggregator(triggers);

    const alphaSpy = sinon.spy();
    const betaSpy = sinon.spy();

    aggregator.onAny('alpha', alphaSpy);
    aggregator.onAny('beta', betaSpy);

    triggers[0].alpha();
    triggers[1].beta();

    tick()
      .then(() => {
        expect(alphaSpy).to.have.been.calledOnce;
        expect(betaSpy).to.have.been.calledOnce;

        aggregator.removeListener('alpha', alphaSpy);

        triggers[0].alpha();
        triggers[1].beta();

        return tick();
      })
      .then(() => {
        expect(alphaSpy).to.have.been.calledOnce;
        expect(betaSpy).to.have.been.calledTwice;

        aggregator.removeListener('beta', betaSpy);

        triggers[0].alpha();
        triggers[1].beta();

        return tick();
      })
      .then(() => {
        expect(alphaSpy).to.have.been.calledOnce;
        expect(betaSpy).to.have.been.calledTwice;
        done();
      });
  });
});
