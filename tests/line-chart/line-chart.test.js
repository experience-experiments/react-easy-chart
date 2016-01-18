/* eslint-env node, mocha */
import {should as chaiShould, expect} from 'chai';
import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import {LineChart} from 'react-easy-chart';

const should = chaiShould();
const testDataBasic = [[
  {key: 1, value: 2},
  {key: 2, value: 3},
  {key: 3, value: 4},
  {key: 4, value: 5},
  {key: 5, value: 13}
]];

const testDataTextKey = [[
  {key: 'Mon', value: 2},
  {key: 'Tue', value: 3},
  {key: 'Wed', value: 4},
  {key: 'Thu', value: 5},
  {key: 'Fri', value: 13}
]];

describe('LineChart component', () => {
  it('should be defined', () => {
    should.exist(LineChart);
    LineChart.should.be.a('function');
  });

  it('should render without problems', () => {
    const chart = TestUtils.renderIntoDocument(<LineChart data={testDataBasic}/>);
    should.exist(chart);
  });

  it('should have default values for optional properties', () => {
    const chart = TestUtils.renderIntoDocument(<LineChart data={testDataBasic}/>);
    chart.should.have.property('props');
    chart.props.data.should.have.length(1);
  });

  it('Test for chart rendering with text data keys', () => {
    const shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<LineChart data={testDataTextKey}/>);
    const vdom = shallowRenderer.getRenderOutput();
    expect(vdom.type).to.equal('div');
    const svg = vdom.props.children[1];
    expect(svg.type).to.equal('svg');
    // const g = svg.props.children[0];
  });
});
