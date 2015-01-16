var chai      = require('chai');
var sinon     = require('sinon');
var sinonChai = require('sinon-chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.use(sinonChai);

global.expect = chai.expect;
global.sinon  = sinon;

