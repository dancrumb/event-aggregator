import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import dirtyChai from 'dirty-chai';


chai.use(dirtyChai);
chai.use(sinonChai);


global.expect = chai.expect;
global.sinon = sinon;

global.tick = () => new Promise((resolve) => { process.nextTick(resolve); });
