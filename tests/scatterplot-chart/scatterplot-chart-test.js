/* eslint-env node, mocha */
import chai, {should as chaiShould, expect} from 'chai';
import {ScatterplotChart} from 'react-easy-chart';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react/lib/ReactTestUtils';
import spies from 'chai-spies';

const should = chaiShould();
chai.use(spies);

const testData = [
  {
    'type': 'One',
    'x': 1,
    'y': 5
  },
  {
    'type': 'Two',
    'x': 3,
    'y': 1
  },
  {
    'type': 'Three',
    'x': 0,
    'y': 6
  }
];

const config = [
  {
    type: 'One',
    color: '#ff0000',
    stroke: 'blue'
  },
  {
    type: 'Two',
    color: '#00ff00',
    stroke: 'blue'
  },
  {
    type: 'Three',
    color: '#ffffff',
    stroke: 'black'
  }
];

describe('Scatterplot Chart', () => {
  it('should be defined', () => {
    should.exist(ScatterplotChart);
    ScatterplotChart.should.be.a('function');
  });

  it('should render without problems', () => {
    const chart = TestUtils.renderIntoDocument(<ScatterplotChart data={testData} />);
    should.exist(chart);
  });

  it('should render the correct number of data points', () => {
    document.body.appendChild(document.createElement('div'));
    const chart = ReactDOM.render(<ScatterplotChart data={testData} />, document.getElementsByTagName('div')[0]);
    const chartDom = ReactDOM.findDOMNode(chart);
    const svgNode = chartDom.childNodes[1];
    const g = svgNode.childNodes[0].childNodes[2];
    expect(g.childNodes.length).to.equal(testData.length);
  });
  /*
  * This doesn't work
  *
  it('should support mouseOver, mouseOut, mousemove and click', () => {
    const mouseOverSpy = chai.spy(() => {});
    const mouseOutSpy = chai.spy(() => {});
    const mouseMoveSpy = chai.spy(() => {});
    const click = chai.spy(() => {});
    const chart = ReactDOM.render(
      <ScatterplotChart
        data={testData}
        mouseOverHandler={mouseOverSpy}
        mouseOutHandler={mouseOutSpy}
        mouseMoveHandler={mouseMoveSpy}
        clickHandler={click}
      />,
      document.getElementsByTagName('div')[0]
    );
    const chartDom = ReactDOM.findDOMNode(chart);
    const svgNode = chartDom.childNodes[1];
    const dot = svgNode.childNodes[0].childNodes[2].childNodes[0];
    TestUtils.SimulateNative.mouseOver(dot);
    expect(mouseOverSpy).to.have.been.called();

    TestUtils.SimulateNative.mouseOut(dot);
    expect(mouseOutSpy).to.have.been.called();

    TestUtils.SimulateNative.mouseMove(dot);
    expect(mouseMoveSpy).to.have.been.called();
  });*/
});
