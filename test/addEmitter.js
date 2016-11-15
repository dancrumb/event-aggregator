import EmitterFactory from './EmitterFactory';
import EventAggregator from '../src/index';

describe('EventAggregator#addEmitter', () => {
  it('adds an emitter to an aggregator', (done) => {
    const triggers = EmitterFactory.create(3);
    const aggregator = new EventAggregator(triggers[2]);

    const eventSpy = sinon.spy();

    aggregator.onAny('alpha', eventSpy);
    aggregator.addEmitter(triggers[0]);

    triggers[0].alpha();

    tick()
      .then(() => {
        expect(eventSpy).to.have.been.calledOnce();
        triggers[1].alpha();
        return tick();
      })
      .then(() => {
        expect(eventSpy).to.have.been.calledOnce();
        aggregator.addEmitter(triggers[1]);
        triggers[1].alpha();
        return tick();
      })
      .then(() => {
        expect(eventSpy).to.have.been.calledTwice();
        done();
      });
  });
});
