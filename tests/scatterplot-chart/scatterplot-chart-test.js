/* eslint-env node, mocha */
import chai, {should as chaiShould, expect} from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react/lib/ReactTestUtils';
import {ScatterplotChart} from 'rc-d3';
import spies from 'chai-spies';

const should = chaiShould();
chai.use(spies);

describe('Scatterplot Chart', () => {
  it('should be defined', () => {
    should.exist(ScatterplotChart);
    ScatterplotChart.should.be.a('function');
  });
});
