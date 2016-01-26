/* eslint-env node, mocha */
import chai, {should as chaiShould} from 'chai';
import {ScatterplotChart} from 'react-easy-chart';
import spies from 'chai-spies';

const should = chaiShould();
chai.use(spies);

describe('Scatterplot Chart', () => {
  it('should be defined', () => {
    should.exist(ScatterplotChart);
    ScatterplotChart.should.be.a('function');
  });
});
