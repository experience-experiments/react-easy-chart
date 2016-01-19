/* eslint-env node, mocha */
import {should as chaiShould, expect} from 'chai';
import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import {PieChart} from 'react-easy-chart';

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

    // Data
    chart.props.data.should.have.length(2);

    // Height
    expect(chart.props).to.have.property('height', 200);

    // innerHoleHeight
    expect(chart.props).to.have.property('innerHoleHeight', 0);

    // padding
    expect(chart.props).to.have.property('padding', 2);

    // hasLabels: false,
    expect(chart.props).to.have.property('hasLabels', false);
  });

  it('should render an svg and 2 arcs', () => {
    const shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<PieChart data={testData}/>);
    const vdom = shallowRenderer.getRenderOutput();
    expect(vdom.type).to.equal('div');
    const svg = vdom.props.children[1];
    expect(svg.type).to.equal('svg');
    const g = svg.props.children[0];
    expect(g.props.transform).to.equal('translate(100, 100)');
    expect(g.props.children.length).to.equal(2);
  });
});
