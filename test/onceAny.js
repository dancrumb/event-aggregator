import EmitterFactory from './EmitterFactory';
import EventAggregator from '../src/index';

describe('EventAggregator#onceAny', () => {
  it('fires an event once when any constituent events fire', (done) => {
    const triggers = EmitterFactory.create(4);
    const aggregator = new EventAggregator(triggers);

    const eventSpy = sinon.spy();

    aggregator.onceAny('alpha', eventSpy);

    triggers[0].alpha();

    tick()
      .then(() => {
        expect(eventSpy).to.have.been.calledOnce();
        triggers[1].alpha();
        return tick();
      })
      .then(() => {
        expect(eventSpy).to.have.been.calledOnce();
        triggers[0].alpha();
        return tick();
      })
      .then(() => {
        expect(eventSpy).to.have.been.calledOnce();
        done();
      });
  });

  it('supports listeners being added and removed', (done) => {
    EmitterFactory.reset();
    const triggers = EmitterFactory.create(2);
    const aggregator = new EventAggregator(triggers);

    const alphaSpy = sinon.spy();
    const betaSpy = sinon.spy();

    aggregator.onceAny('alpha', alphaSpy);
    aggregator.onceAny('beta', betaSpy);

    triggers[0].alpha();
    triggers[1].beta();

    tick()
      .then(() => {
        expect(alphaSpy).to.have.been.calledOnce();
        expect(betaSpy).to.have.been.calledOnce();

        aggregator.removeListener('alpha', alphaSpy);

        triggers[0].alpha();
        triggers[1].beta();

        return tick();
      })
      .then(() => {
        expect(alphaSpy).to.have.been.calledOnce();
        expect(betaSpy).to.have.been.calledOnce();

        aggregator.removeListener('beta', betaSpy);

        triggers[0].alpha();
        triggers[1].beta();

        return tick();
      })
      .then(() => {
        expect(alphaSpy).to.have.been.calledOnce();
        expect(betaSpy).to.have.been.calledOnce();
        done();
      });
  });
});
