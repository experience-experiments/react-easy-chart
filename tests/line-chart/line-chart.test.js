/* eslint-env node, mocha */
import {should as chaiShould} from 'chai';
import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import {LineChart} from 'rc-d3';

const should = chaiShould();
const testData = [
  [1, 2],
  [2, 3],
  [3, 5],
  [4, 8],
  [5, 13]
];

describe('LineChart component', () => {
  it('should be defined', () => {
    should.exist(LineChart);
    LineChart.should.be.a('function');
  });

  it('should render without problems', () => {
    const chart = TestUtils.renderIntoDocument(<LineChart data={testData}/>);
    should.exist(chart);
  });

  it('should have default values for optional properties', () => {
    const chart = TestUtils.renderIntoDocument(<LineChart data={testData}/>);
    chart.should.have.property('props');
    chart.props.data.should.have.length(5);
  });
});
