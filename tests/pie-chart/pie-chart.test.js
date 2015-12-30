/* eslint-env node, mocha */
import {should as chaiShould} from 'chai';
import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import {PieChart} from 'rc-d3';

const should = chaiShould();

const testData = [
  {
    label: 'section 1',
    value: 5,
    color: '#1f77b4'
  },
  {
    label: 'section 2',
    value: 10,
    color: '#ff7f0e'
  }
];

describe('PieChart component', () => {
  it('should be defined', () => {
    should.exist(PieChart);
    PieChart.should.be.a('function');
  });

  it('should render without problems', () => {
    const chart = TestUtils.renderIntoDocument(<PieChart data={testData}/>);
    should.exist(chart);
  });

  it('should have default values for optional properties', () => {
    const chart = TestUtils.renderIntoDocument(<PieChart data={testData}/>);
    chart.should.have.property('props');
    chart.props.data.should.have.length(2);
  });
});
