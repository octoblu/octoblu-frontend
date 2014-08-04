var chai          = require('chai'),
    sinon         = require('sinon'),
    sinonChai     = require('sinon-chai'),
    _             = require('underscore');

chai.use(sinonChai);

global.expect = chai.expect;
global.sinon  = sinon;


