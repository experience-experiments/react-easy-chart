/* eslint-env node, mocha */
import chai, {should as chaiShould, expect} from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react/lib/ReactTestUtils';
import { BarChart } from 'react-easy-chart';
import spies from 'chai-spies';

const should = chaiShould();
chai.use(spies);

const mouseOverSpy = chai.spy(() => {});
const mouseOutSpy = chai.spy(() => {});
const mouseMoveSpy = chai.spy(() => {});
const clickSpy = chai.spy(() => {});

const testData = [
  {key: 'A', value: 0.5},
  {key: 'B', value: 0.2},
  {key: 'C', value: 0.1}];

describe('BarChart component', () => {
  it('should be defined as a function', () => {
    should.exist(BarChart);
    BarChart.should.be.a('function');
  });

  describe('Instantiating the BarChart', () => {
    describe('With required props', () => {
      describe('Always', () => {
        const chart = TestUtils.renderIntoDocument(<BarChart data={testData} />);

        it('should render successfully', () => {
          should.exist(chart);
        });

        it('should assign the prop \'data\' to \'props.data\' on the instance', () => {
          expect(chart.props).to.have.property('data', testData);
        });
      });

      describe('Without optional props', () => {
        const chart = TestUtils.renderIntoDocument(<BarChart data={testData} />);

        it('should use default values for optional props', () => {
          /**
           * Bar Charts must have non-zero width and height. We
           * default to 400 x 300
           */
          expect(chart.props).to.have.property('width', 400);
          expect(chart.props).to.have.property('height', 200);
          /**
           * Bar Charts must have a non-zero width for the bars
           * on the graph. We default to 10
           */
          expect(chart.props).to.have.property('barWidth', 10);
          /**
           * We provide a pattern for formatting dates
           */
          expect(chart.props).to.have.property('datePattern', '%d-%b-%y');
          /**
           * Bar Charts can render without x and y axes. We assume that there are no
           * axes to render unless they are passed to the component!
           */
          expect(chart.props).to.have.property('axes', false);
          /**
           * But we provide default values for the axes types, anyway
           */
          expect(chart.props).to.have.property('xType', 'text');
          expect(chart.props).to.have.property('yType', 'linear');
          /**
           * And the method to blend between values
           */
          expect(chart.props).to.have.property('interpolate', 'linear');
          /**
           * Bar Charts can render without axis labels. We default to
           * empty strings
           */
          expect(chart.props).to.have.deep.property('axisLabels.x');
          expect(chart.props.axisLabels.x).to.have.lengthOf(0);
          expect(chart.props).to.have.deep.property('axisLabels.y');
          expect(chart.props.axisLabels.y).to.have.lengthOf(0);
        });
      });

      describe('With optional props', () => {
        const chart = TestUtils.renderIntoDocument(
          <BarChart data={testData}
            axisLabels={{x: 'Mock x Axis Label', y: 'Mock y Axis Label'}}
            margin={{top: 0, right: 0, bottom: 0, left: 0}}
            mouseOverHandler={mouseOverSpy}
            mouseOutHandler={mouseOutSpy}
            mouseMoveHandler={mouseMoveSpy}
            clickHandler={clickSpy}
          />
        );

        it('should consume the prop values as props', () => {
          /**
           * Bar Charts should render with the margins provided
           */
          expect(chart.props).to.have.deep.property('margin.top', 0);
          expect(chart.props).to.have.deep.property('margin.right', 0);
          expect(chart.props).to.have.deep.property('margin.bottom', 0);
          expect(chart.props).to.have.deep.property('margin.left', 0);
          /**
           * Bar Charts should render with the axis labels provided
           */
          expect(chart.props).to.have.deep.property('axisLabels.x', 'Mock x Axis Label');
          expect(chart.props).to.have.deep.property('axisLabels.y', 'Mock y Axis Label');
          /**
           * And consume the handlers
           */
          expect(chart.props).to.have.deep.property('mouseOverHandler', mouseOverSpy);
          expect(chart.props).to.have.deep.property('mouseOutHandler', mouseOutSpy);
          expect(chart.props).to.have.deep.property('mouseMoveHandler', mouseMoveSpy);
          expect(chart.props).to.have.deep.property('clickHandler', clickSpy);
        });
      });
    });
  });

  describe('Rendering the BarChart', () => {
    describe('Always', () => {
      const renderer = TestUtils.createRenderer();
      renderer.render(<BarChart data={testData} />);

      const chart = renderer.getRenderOutput();
      const svg = chart.props.children[1];
      const graph = svg.props.children[0];

      it('should render a \'div\' container', () => {
        expect(chart.type).to.equal('div');
      });

      it('should render a \'svg\' child', () => {
        expect(svg.type).to.equal('svg');
      });

      it('should render the graph', () => {
        expect(graph.props.transform).to.equal('translate(0,0)');
        expect(graph.props.children[0].type).to.equal('rect');
        expect(graph.props.children[1].type).to.equal('rect');
        expect(graph.props.children[2].type).to.equal('rect');
      });
    });

    describe('With optional props', () => {
      const chart = TestUtils.renderIntoDocument(
        <BarChart data={testData}
          mouseOverHandler={mouseOverSpy}
          mouseOutHandler={mouseOutSpy}
          mouseMoveHandler={mouseMoveSpy}
          clickHandler={clickSpy}
        />
      );
      const domRoot = ReactDOM.findDOMNode(chart);
      const svgNode = domRoot.childNodes[1];
      const barNode = svgNode.childNodes[0].childNodes[1];

      it('should respond to click events', () => {
        TestUtils.Simulate.click(barNode);
        expect(clickSpy).to.have.been.called();
      });

      it('should respond to mouse over events', () => {
        TestUtils.SimulateNative.mouseOver(barNode);
        expect(mouseOverSpy).to.have.been.called();
      });

      it('should respond to mouse out events', () => {
        TestUtils.SimulateNative.mouseOut(barNode);
        expect(mouseOutSpy).to.have.been.called();
      });

      it('should respond to mouse move events', () => {
        TestUtils.SimulateNative.mouseMove(barNode);
        expect(mouseMoveSpy).to.have.been.called();
      });
    });
  });
});
