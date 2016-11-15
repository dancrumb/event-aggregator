import EmitterFactory from './EmitterFactory';
import EventAggregator from '../src/index';

describe('EventAggregator#onAny', () => {
  it('fires an event once when any constituent events fire', (done) => {
    const triggers = EmitterFactory.create(4);
    const aggregator = new EventAggregator(triggers);

    const eventSpy = sinon.spy();

    aggregator.onAny('alpha', eventSpy);

    triggers[0].alpha();

    tick()
      .then(() => {
        expect(eventSpy).to.have.been.calledOnce();
        triggers[1].alpha();
        return tick();
      })
      .then(() => {
        expect(eventSpy).to.have.been.calledTwice();
        triggers[0].alpha();
        return tick();
      })
      .then(() => {
        expect(eventSpy).to.have.been.calledThrice();
        done();
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
        expect(alphaSpy).to.have.been.calledOnce();
        expect(betaSpy).to.have.been.calledOnce();

        aggregator.removeListener('alpha', alphaSpy);

        triggers[0].alpha();
        triggers[1].beta();

        return tick();
      })
      .then(() => {
        expect(alphaSpy).to.have.been.calledOnce();
        expect(betaSpy).to.have.been.calledTwice();

        aggregator.removeListener('beta', betaSpy);

        triggers[0].alpha();
        triggers[1].beta();

        return tick();
      })
      .then(() => {
        expect(alphaSpy).to.have.been.calledOnce();
        expect(betaSpy).to.have.been.calledTwice();
        done();
      });
  });

  it('provides a reference to the event source', (done) => {
    EmitterFactory.reset();
    const triggers = EmitterFactory.create(4);
    const aggregator = new EventAggregator(triggers);

    const eventSpy = sinon.spy();

    aggregator.onAny('alpha', eventSpy);

    triggers[0].alpha();

    tick()
      .then(() => {
        expect(eventSpy).to.have.been.calledOnce();
        expect(eventSpy).to.have.been.calledWith(triggers[0], [0]);
        done();
      });
  });
});
