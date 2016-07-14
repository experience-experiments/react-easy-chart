/* eslint-env node, mocha */
/* eslint no-unused-expressions: 0, max-len: 0 */

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react/lib/ReactTestUtils';
import chai, { expect } from 'chai'; // { should as shouldFactory, expect } from 'chai';
import sinon from 'sinon';
import spies from 'chai-spies';
import { LineChart } from 'react-easy-chart';

// const should = shouldFactory();

chai.use(spies);

const mockAxisLabels = {
  x: 'Mock X Label',
  y: 'Mock Y Label'
};

const mockW = 200;
const mockH = 150;
const mockM = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};
const mockX = {};
const mockY = {};
const mockNode = {};
const mockRoot = {
  data: () => mockRoot,
  attr: () => mockRoot,
  call: () => mockRoot,
  text: () => mockRoot,
  selectAll: () => mockRoot,
  append: () => mockRoot,
  style: () => mockRoot,
  datum: () => mockRoot,
  enter: () => mockRoot,
  on: () => mockRoot
};

const mockXType = 'linear';
const mockYType = 'linear';

const mockXValue = () => {};
const mockYValue = () => {};

const mockColors = [];

const mockXDomainRange = [];
const mockYDomainRange = [];

const mouseOverSpy = chai.spy(() => {});
const mouseOutSpy = chai.spy(() => {});
const mouseMoveSpy = chai.spy(() => {});
const clickSpy = chai.spy(() => {});

const mockData = [
  [
    { x: 1, y: 20 },
    { x: 2, y: 10 },
    { x: 3, y: 25 }
  ]
];

describe('LineChart component', () => {
  it('should be defined as a function', () => {
    LineChart.should.be.a('function');
  });

  describe('Instantiating the LineChart', () => {
    describe('Without required props', () => {
      it('throws a \'TypeError\'', () => {
        expect(() => {
          TestUtils.renderIntoDocument(
            <LineChart />
          );
        }).to.throw(TypeError);
      });
    });

    describe('With required props', () => {
      describe('Always', () => {
        let chart;

        beforeEach(() => {
          sinon.spy(LineChart.prototype, 'render');
          chart = TestUtils.renderIntoDocument(
            <LineChart
              data={mockData}
            />
          );
        });

        afterEach(() => {
          LineChart.prototype.render.restore();
        });

        it('renders', () => {
          expect(chart.render.called).to.be.true;
        });

        /*
         *  Integration test
         */
        it('assigns the prop \'data\' to \'props.data\' on the instance', () => {
          expect(chart.props).to.have.property('data', mockData);
        });

        /*
         * Creation of 'parseDate' should be mocked
         */
        it('assigns the method \'parseDate\' to the instance', () => {
          expect(chart.parseDate).to.be.a('function');
        });

        /*
         * Creation of 'uid' should be mocked
         */
        it('creates a uid and assigns it to the instance', () => {
          expect(chart.uid).to.not.be.an('undefined');
        });
      });

      describe('Without optional props', () => {
        describe('Consuming the \'defaultProps\'', () => {
          const chart = TestUtils.renderIntoDocument(
            <LineChart
              data={mockData}
            />
          );

          it('has a width and height for the chart', () => {
            /**
             * Line Charts must have non-zero width and height. We
             * default to 400 x 300
             */
            expect(chart.props).to.have.property('width', mockW);
            expect(chart.props).to.have.property('height', mockH);
          });

          it('has a pattern for formatting dates on the chart', () => {
            /**
             * We provide a pattern for formatting dates
             */
            expect(chart.props).to.have.property('datePattern', '%d-%b-%y');
          });

          it('can render successfully without axes (\'axes\' is \'false\')', () => {
            /**
             * Line Charts can render without x and y axes. We assume that there are no
             * axes to render unless they are passed to the component!
             */
            expect(chart.props).to.have.property('axes', false);
          });

          it('has types for the axes (\'axes\' is \'true\' but types are unspecified)', () => {
            /**
             * But we provide default values for the axes types, anyway
             */
            expect(chart.props).to.have.property('xType', mockXType); // 'text'
            expect(chart.props).to.have.property('yType', mockYType); // 'linear'
          });

          it('colors the areas according to the \'lineColors\' array', () => {
            /**
             * Concatenated into the 'defaultColors' array
             */
            expect(chart.props.lineColors).to.eql([]);
          });

          it('blends between values according to the \'interpolation\' method', () => {
            /**
             * And the method to blend between values
             */
            expect(chart.props).to.have.property('interpolate', 'linear');
          });

          it('has labels for the axes (\'axes\' is \'true\' but their labels are unspecified)', () => {
            /**
             * Line Charts can render without axis labels. We default to
             * empty strings
             */
            expect(chart.props).to.have.deep.property('axisLabels.x');
            expect(chart.props.axisLabels.x).to.have.lengthOf(0);
            expect(chart.props).to.have.deep.property('axisLabels.y');
            expect(chart.props.axisLabels.y).to.have.lengthOf(0);
          });

          it('has event handlers for events raised by the chart (no op)', () => {
            /*
             * Line Charts can raise events. We default to "no op" handlers
             */
            expect(chart.props.mouseOverHandler).to.be.a('function');
            expect(chart.props.mouseOutHandler).to.be.a('function');
            expect(chart.props.mouseMoveHandler).to.be.a('function');
            expect(chart.props.clickHandler).to.be.a('function');
          });
        });

        describe('Rendering with \'defaultProps\'', () => {
          let chart;

          beforeEach(() => {
            sinon.spy(LineChart.prototype, 'calculateChartParameters');
            sinon.spy(LineChart.prototype, 'createXAxis');
            sinon.spy(LineChart.prototype, 'createYAxis');
            sinon.spy(LineChart.prototype, 'createLinePathChart');
            sinon.spy(LineChart.prototype, 'createPoints');
            sinon.spy(LineChart.prototype, 'createStyle');
            chart = TestUtils.renderIntoDocument(
              <LineChart
                data={mockData}
              />
            );
          });

          afterEach(() => {
            LineChart.prototype.calculateChartParameters.restore();
            LineChart.prototype.createXAxis.restore();
            LineChart.prototype.createYAxis.restore();
            LineChart.prototype.createLinePathChart.restore();
            LineChart.prototype.createPoints.restore();
            LineChart.prototype.createStyle.restore();
          });

          it('calculates the chart parameters', () => {
            expect(chart.calculateChartParameters.called).to.be.true;
          });

          it('does not create the x axis (\'axes\' is \'false\')', () => {
            expect(chart.createXAxis.called).to.be.false;
          });

          it('does not create the y axis (\'axes\' is \'false\')', () => {
            expect(chart.createYAxis.called).to.be.false;
          });

          it('does not create the points (\'dataPoints\' is \'false\')', () => {
            expect(chart.createPoints.called).to.be.false;
          });

          it('creates the line chart', () => {
            expect(chart.createLinePathChart.called).to.be.true;
          });

          it('creates the <Style /> component', () => {
            expect(chart.createStyle.called).to.be.true;
          });

          /*
           * Mock node.toReact()
           */
        });
      });

      describe('With optional props', () => {
        describe('\'axes\' is \'true\'', () => {
          describe('Always', () => {
            let chart;

            beforeEach(() => {
              sinon.spy(LineChart.prototype, 'createXAxis');
              sinon.spy(LineChart.prototype, 'createYAxis');
              chart = TestUtils.renderIntoDocument(
                <LineChart
                  data={mockData}
                  axes
                />
              );
            });

            afterEach(() => {
              LineChart.prototype.createXAxis.restore();
              LineChart.prototype.createYAxis.restore();
            });

            it('creates the x axis', () => {
              expect(chart.createXAxis.called).to.be.true;
            });

            it('creates the y axis', () => {
              expect(chart.createYAxis.called).to.be.true;
            });
          });
        });
      });
    });
  });

  describe('calculateChartParameters()', () => {
    let chart;
    let p;

    beforeEach(() => {
      chart = TestUtils.renderIntoDocument(
        <LineChart
          data={mockData}
        />
      );
      sinon.stub(chart, 'createSvgNode').returns(mockNode);
      sinon.stub(chart, 'createSvgRoot').returns(mockRoot);
      p = chart.calculateChartParameters();
    });

    afterEach(() => {
      chart.createSvgNode.restore();
      chart.createSvgRoot.restore();
    });

    it('creates the svg node', () => {
      expect(chart.createSvgNode.calledWith({
        w: mockW,
        h: mockH,
        m: mockM
      })).to.be.true;
    });

    it('creates the svg root', () => {
      expect(chart.createSvgRoot.calledWith({
        node: mockNode,
        m: mockM
      })).to.be.true;
    });

    it('returns the parameters as an object', () => {
      expect(p.m).to.eql(mockM);
      expect(p).to.have.property('w', mockW);
      expect(p).to.have.property('h', mockH);
      expect(p.x).to.be.a('function');
      expect(p.y).to.be.a('function');
      expect(p.xValue).to.be.a('function');
      expect(p.yValue).to.be.a('function');
      expect(p.colors).to.be.an('array');
      expect(p).to.have.property('node', mockNode);
      expect(p).to.have.property('root', mockRoot);
    });
  });

  describe('createXAxis()', () => {
    const p = {
      root: mockRoot,
      w: mockW,
      h: mockH,
      m: mockM,
      x: mockX,
      y: mockY
    };

    beforeEach(() => {
      sinon.spy(mockRoot, 'append');
      sinon.spy(mockRoot, 'attr');
      sinon.spy(mockRoot, 'call');
      sinon.spy(mockRoot, 'style');
      sinon.spy(mockRoot, 'text');
    });

    afterEach(() => {
      mockRoot.append.restore();
      mockRoot.attr.restore();
      mockRoot.call.restore();
      mockRoot.style.restore();
      mockRoot.text.restore();
    });

    describe('Y axis orient to the left hand side (\'yAxisOrientRight\' is \'false\')', () => {
      beforeEach(() => {
        const chart = TestUtils.renderIntoDocument(
          <LineChart
            data={mockData}
            axisLabels={mockAxisLabels}
          />
        );
        chart.createXAxis(p);
      });

      it('creates the x axis', () => {
        expect(mockRoot.append.calledWith('g')).to.be.true;
        expect(mockRoot.attr.calledWith('class', 'x axis')).to.be.true;
        expect(mockRoot.attr.calledWith('transform', 'translate(0, 150)')).to.be.true;
        expect(mockRoot.call.called).to.be.true;
        expect(mockRoot.append.calledWith('text')).to.be.true;
        expect(mockRoot.attr.calledWith('class', 'label')).to.be.true;
        expect(mockRoot.attr.calledWith('x', mockW)).to.be.true;
        expect(mockRoot.attr.calledWith('y', -10)).to.be.true;
        expect(mockRoot.style.calledWith('text-anchor', 'end')).to.be.true;
        expect(mockRoot.text.calledWith('Mock X Label')).to.be.true;
      });
    });

    describe('Y axis orient tp the right hand side (\'yAxisOrientRight\' is \'true\')', () => {
      beforeEach(() => {
        const chart = TestUtils.renderIntoDocument(
          <LineChart
            data={mockData}
            axisLabels={mockAxisLabels}
            yAxisOrientRight
          />
        );
        chart.createXAxis(p);
      });

      it('creates the x axis', () => {
        expect(mockRoot.append.calledWith('g')).to.be.true;
        expect(mockRoot.attr.calledWith('class', 'x axis')).to.be.true;
        expect(mockRoot.attr.calledWith('transform', 'translate(0, 150)')).to.be.true;
        expect(mockRoot.call.called).to.be.true;
        expect(mockRoot.append.calledWith('text')).to.be.true;
        expect(mockRoot.attr.calledWith('class', 'label')).to.be.true;
        expect(mockRoot.attr.calledWith('x', 0)).to.be.true;
        expect(mockRoot.attr.calledWith('y', -10)).to.be.true;
        expect(mockRoot.style.calledWith('text-anchor', 'start')).to.be.true;
        expect(mockRoot.text.calledWith('Mock X Label')).to.be.true;
      });
    });
  });

  describe('createYAxis()', () => {
    const p = {
      root: mockRoot,
      w: mockW,
      h: mockH,
      m: mockM,
      x: mockX,
      y: mockY
    };

    beforeEach(() => {
      sinon.spy(mockRoot, 'append');
      sinon.spy(mockRoot, 'attr');
      sinon.spy(mockRoot, 'call');
      sinon.spy(mockRoot, 'style');
      sinon.spy(mockRoot, 'text');
    });

    afterEach(() => {
      mockRoot.append.restore();
      mockRoot.attr.restore();
      mockRoot.call.restore();
      mockRoot.style.restore();
      mockRoot.text.restore();
    });

    describe('Y axis orient to the left hand side (\'yAxisOrientRight\' is \'false\')', () => {
      beforeEach(() => {
        const chart = TestUtils.renderIntoDocument(
          <LineChart
            data={mockData}
            axisLabels={mockAxisLabels}
          />
        );
        chart.createYAxis(p);
      });

      it('creates the y axis', () => {
        expect(mockRoot.append.calledWith('g')).to.be.true;
        expect(mockRoot.attr.calledWith('class', 'y axis')).to.be.true;
        expect(mockRoot.attr.calledWith('transform', 'translate(0, 0)')).to.be.true;
        expect(mockRoot.call.called).to.be.true;
        expect(mockRoot.append.calledWith('text')).to.be.true;
        expect(mockRoot.attr.calledWith('class', 'label')).to.be.true;
        expect(mockRoot.attr.calledWith('transform', 'rotate(-90)')).to.be.true;
        expect(mockRoot.attr.calledWith('x', 0)).to.be.true;
        expect(mockRoot.attr.calledWith('y', 0)).to.be.true;
        expect(mockRoot.attr.calledWith('dy', '.9em')).to.be.true;
        expect(mockRoot.style.calledWith('text-anchor', 'end')).to.be.true;
        expect(mockRoot.text.calledWith('Mock Y Label')).to.be.true;
      });
    });

    describe('Y axis orient to the right hand side (\'yAxisOrientRight\' is \'true\')', () => {
      beforeEach(() => {
        const chart = TestUtils.renderIntoDocument(
          <LineChart
            data={mockData}
            axisLabels={mockAxisLabels}
            yAxisOrientRight
          />
        );
        chart.createYAxis(p);
      });

      it('creates the y axis', () => {
        expect(mockRoot.append.calledWith('g')).to.be.true;
        expect(mockRoot.attr.calledWith('class', 'y axis')).to.be.true;
        expect(mockRoot.attr.calledWith('transform', 'translate(200, 0)')).to.be.true;
        expect(mockRoot.call.called).to.be.true;
        expect(mockRoot.append.calledWith('text')).to.be.true;
        expect(mockRoot.attr.calledWith('class', 'label')).to.be.true;
        expect(mockRoot.attr.calledWith('transform', 'rotate(-90)')).to.be.true;
        expect(mockRoot.attr.calledWith('x', 0)).to.be.true;
        expect(mockRoot.attr.calledWith('y', -20)).to.be.true;
        expect(mockRoot.attr.calledWith('dy', '.9em')).to.be.true;
        expect(mockRoot.style.calledWith('text-anchor', 'end')).to.be.true;
        expect(mockRoot.text.calledWith('Mock Y Label')).to.be.true;
      });
    });
  });

  describe('createLinePathChart()', () => {
    const p = {
      m: mockM,
      w: mockW,
      h: mockH,
      x: mockX,
      y: mockY,
      xValue: mockXValue,
      yValue: mockYValue,
      colors: mockColors,
      root: mockRoot
    };

    beforeEach(() => {
      sinon.spy(mockRoot, 'datum');
      sinon.spy(mockRoot, 'append');
      sinon.spy(mockRoot, 'attr');

      const chart = TestUtils.renderIntoDocument(
        <LineChart
          data={mockData}
          axisLabels={mockAxisLabels}
        />
      );
      chart.createLinePathChart(p);
    });

    afterEach(() => {
      mockRoot.datum.restore();
      mockRoot.append.restore();
      mockRoot.attr.restore();
    });

    it('creates the line chart', () => {
      expect(mockRoot.append.calledWith('path')).to.be.true;
      expect(mockRoot.datum.called).to.be.true;
      expect(mockRoot.attr.calledWith('class', 'line')).to.be.true;
      expect(mockRoot.attr.calledWith('style')).to.be.true;
      expect(mockRoot.attr.calledWith('d')).to.be.true;
    });
  });

  describe('createPoints()', () => {
    let chart;
    const p = {
      m: mockM,
      w: mockW,
      h: mockH,
      x: mockX,
      y: mockY,
      colors: mockColors,
      root: mockRoot
    };

    beforeEach(() => {
      sinon.spy(mockRoot, 'append');
      sinon.spy(mockRoot, 'datum');
      sinon.spy(mockRoot, 'attr');
      sinon.spy(mockRoot, 'style');
      sinon.spy(mockRoot, 'on');

      chart = TestUtils.renderIntoDocument(
        <LineChart
          data={mockData}
          dataPoints
        />
      );
      chart.createPoints(p);
    });

    afterEach(() => {
      mockRoot.append.restore();
      mockRoot.datum.restore();
      mockRoot.attr.restore();
      mockRoot.style.restore();
      mockRoot.on.restore();
    });

    it('creates the data points', () => {
      expect(mockRoot.append.calledWith('circle')).to.be.true;
      expect(mockRoot.attr.calledWith('class', 'data-point')).to.be.true;
      expect(mockRoot.style.calledWith('strokeWidth', '2px')).to.be.true;
      expect(mockRoot.style.calledWith('stroke')).to.be.true;
      expect(mockRoot.style.calledWith('fill', 'white')).to.be.true;
      expect(mockRoot.attr.calledWith('cx')).to.be.true;
      expect(mockRoot.on.calledWith('mouseover')).to.be.true;
      expect(mockRoot.on.calledWith('mouseout')).to.be.true;
      expect(mockRoot.on.calledWith('mousemove')).to.be.true;
      expect(mockRoot.on.calledWith('click')).to.be.true;
    });
  });

  describe('Rendering the LineChart', () => {
    xdescribe('Always', () => {
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <LineChart
          data={mockData}
        />
      );

      const chart = renderer.getRenderOutput();
      const svg = chart.props.children[1];
      const graph = svg.props.children[0];

      it('renders a <div /> container', () => {
        expect(chart.type).to.equal('div');
      });

      it('renders a <svg /> child', () => {
        expect(svg.type).to.equal('svg');
      });

      it('renders the graph', () => {
        expect(graph.props.transform).to.equal('translate(0, 0)');
        expect(graph.props.children[0].type).to.equal('path');
        expect(graph.props.children[1].type).to.equal('path');
      });
    });

    describe('With optional props', () => {
      const chart = TestUtils.renderIntoDocument(
        <LineChart
          data={mockData}
          dataPoints
          mouseOverHandler={mouseOverSpy}
          mouseOutHandler={mouseOutSpy}
          mouseMoveHandler={mouseMoveSpy}
          clickHandler={clickSpy}
        />
      );
      const domRoot = ReactDOM.findDOMNode(chart);
      const svgNode = domRoot.childNodes[1];
      const dataPointNode = svgNode.childNodes[0].childNodes[1]; // 1 - 3

      it('responds to click events', () => {
        TestUtils.Simulate.click(dataPointNode);
        expect(clickSpy).to.have.been.called();
      });

      it('responds to mouse over events', () => {
        TestUtils.SimulateNative.mouseOver(dataPointNode);
        expect(mouseOverSpy).to.have.been.called();
      });

      it('responds to mouse out events', () => {
        TestUtils.SimulateNative.mouseOut(dataPointNode);
        expect(mouseOutSpy).to.have.been.called();
      });

      it('responds to mouse move events', () => {
        TestUtils.SimulateNative.mouseMove(dataPointNode);
        expect(mouseMoveSpy).to.have.been.called();
      });
    });
  });
});
