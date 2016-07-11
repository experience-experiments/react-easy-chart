/* eslint-env node, mocha */
/* eslint no-unused-expressions: 0 */

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react/lib/ReactTestUtils';
import chai, { expect } from 'chai'; // { should as shouldFactory, expect } from 'chai';
import sinon from 'sinon';
import spies from 'chai-spies';
import { BarChart } from 'react-easy-chart';

// const should = shouldFactory();

chai.use(spies);

const mockAxisLabels = {
  x: 'Mock X Label',
  y: 'Mock Y Label'
};

const mockW = 300;
const mockH = 130;
const mockM = {
  top: 20,
  right: 50,
  bottom: 50,
  left: 50
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

const mockXType = 'text';
const mockYType = 'linear';
const mockY2Type = 'linear';

const mockXDomainRange = [];
const mockYDomainRange = [];

const mouseOverSpy = chai.spy(() => {});
const mouseOutSpy = chai.spy(() => {});
const mouseMoveSpy = chai.spy(() => {});
const clickSpy = chai.spy(() => {});

const mockData = [
  { key: 'A', value: 0.5 },
  { key: 'B', value: 0.2 },
  { key: 'C', value: 0.1 }
];

const mockLineData = [
  { x: 'A', y: 800 },
  { x: 'B', y: 1100 },
  { x: 'C', y: 1101 }
];

describe('BarChart component', () => {
  it('should be defined as a function', () => {
    BarChart.should.be.a('function');
  });

  describe('Instantiating the BarChart', () => {
    describe('With required props', () => {
      describe('Always', () => {
        let chart;

        beforeEach(() => {
          sinon.spy(BarChart.prototype, 'render');
          chart = TestUtils.renderIntoDocument(<BarChart data={mockData} />);
        });

        afterEach(() => {
          BarChart.prototype.render.restore();
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
          const chart = TestUtils.renderIntoDocument(<BarChart data={mockData} />);

          it('has a width and height for the chart', () => {
            /**
             * Bar Charts must have non-zero width and height. We
             * default to 400 x 300
             */
            expect(chart.props).to.have.property('width', 400);
            expect(chart.props).to.have.property('height', 200);
          });

          it('has a width for the bar on the chart', () => {
            /**
             * Bar Charts must have a non-zero width for the bars
             * on the graph. We default to 10
             */
            expect(chart.props).to.have.property('barWidth', 10);
          });

          it('has a pattern for formatting dates on the chart', () => {
            /**
             * We provide a pattern for formatting dates
             */
            expect(chart.props).to.have.property('datePattern', '%d-%b-%y');
          });

          it('can render successfully without axes (\'axes\' is \'false\')', () => {
            /**
             * Bar Charts can render without x and y axes. We assume that there are no
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
            expect(chart.props).to.have.property('y2Type', 'linear');
          });

          it('blends between values according to the \'interpolation\' method', () => {
            /**
             * And the method to blend between values
             */
            expect(chart.props).to.have.property('interpolate', 'linear');
          });

          it('has labels for the axes (\'axes\' is \'true\' but their labels are unspecified)', () => {
            /**
             * Bar Charts can render without axis labels. We default to
             * empty strings
             */
            expect(chart.props).to.have.deep.property('axisLabels.x');
            expect(chart.props.axisLabels.x).to.have.lengthOf(0);
            expect(chart.props).to.have.deep.property('axisLabels.y');
            expect(chart.props.axisLabels.y).to.have.lengthOf(0);
          });

          it('has event handlers for events raised by the chart (no op)', () => {
            /*
             * Bar Charts can raise events. We default to "no op" handlers
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
            sinon.spy(BarChart.prototype, 'hasLineData');
            sinon.spy(BarChart.prototype, 'calculateChartParameters');
            sinon.spy(BarChart.prototype, 'createXAxis');
            sinon.spy(BarChart.prototype, 'createYAxis');
            sinon.spy(BarChart.prototype, 'createBarChart');
            sinon.spy(BarChart.prototype, 'createStyle');
            sinon.spy(BarChart.prototype, 'createYAxis2');
            sinon.spy(BarChart.prototype, 'createLinePath');
            chart = TestUtils.renderIntoDocument(<BarChart data={mockData} />);
          });

          afterEach(() => {
            BarChart.prototype.hasLineData.restore();
            BarChart.prototype.calculateChartParameters.restore();
            BarChart.prototype.createXAxis.restore();
            BarChart.prototype.createYAxis.restore();
            BarChart.prototype.createBarChart.restore();
            BarChart.prototype.createStyle.restore();
            BarChart.prototype.createYAxis2.restore();
            BarChart.prototype.createLinePath.restore();
          });

          it('determines if there is line data', () => {
            expect(chart.hasLineData.called).to.be.true;
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

          it('does not create a second y axis (\'hasLineData\' is \'false\')', () => {
            expect(chart.createYAxis2.called).to.be.false;
          });

          it('creates the bar chart', () => {
            expect(chart.createBarChart.called).to.be.true;
          });

          it('does not create a line path (\'hasLineData\' is \'false\')', () => {
            expect(chart.createLinePath.called).to.be.false;
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
              sinon.spy(BarChart.prototype, 'createXAxis');
              sinon.spy(BarChart.prototype, 'createYAxis');
              chart = TestUtils.renderIntoDocument(<BarChart data={mockData} axes />);
            });

            afterEach(() => {
              BarChart.prototype.createXAxis.restore();
              BarChart.prototype.createYAxis.restore();
            });

            it('creates the x axis', () => {
              expect(chart.createXAxis.called).to.be.true;
            });

            it('creates the y axis', () => {
              expect(chart.createYAxis.called).to.be.true;
            });
          });

          describe('\'lineData\' is populated', () => {
            let chart;

            beforeEach(() => {
              sinon.spy(BarChart.prototype, 'createYAxis2');
              sinon.spy(BarChart.prototype, 'createLinePath');
              chart = TestUtils.renderIntoDocument(<BarChart data={mockData} axes lineData={mockLineData} />);
            });

            afterEach(() => {
              BarChart.prototype.createYAxis2.restore();
              BarChart.prototype.createLinePath.restore();
            });

            it('creates a second y axis (\'hasLineData\' is \'true\')', () => {
              expect(chart.createYAxis2.called).to.be.true;
            });

            it('creates a line path (\'hasLineData\' is \'true\')', () => {
              expect(chart.createLinePath.called).to.be.true;
            });
          });
        });
      });
    });

    describe('Without required props', () => {
      it('throws a \'TypeError\'', () => {
        expect(() => {
          TestUtils.renderIntoDocument(<BarChart />);
        }).to.throw(TypeError);
      });
    });
  });

  describe('calculateChartParameters()', () => {
    let chart;
    let stub;
    let p;

    beforeEach(() => {
      chart = TestUtils.renderIntoDocument(<BarChart data={mockData} axes xDomainRange={mockXDomainRange} yDomainRange={mockYDomainRange} />);
      sinon.stub(chart, 'hasLineData').returns(true);
      stub = sinon.stub(chart, 'setScaleDomainRange');
      stub.withArgs('x').returns(mockX);
      stub.withArgs('y').returns(mockY);
      sinon.stub(chart, 'createSvgNode').returns(mockNode);
      sinon.stub(chart, 'createSvgRoot').returns(mockRoot);
      p = chart.calculateChartParameters();
    });

    afterEach(() => {
      chart.hasLineData.restore();
      chart.setScaleDomainRange.restore();
      chart.createSvgNode.restore();
      chart.createSvgRoot.restore();
    });

    it('sets the scale, domain and range of the x axis', () => {
      expect(stub.withArgs('x').calledWith('x', mockXDomainRange, mockData, mockXType, mockW)).to.be.true;
    });

    it('sets the scale, domain and range of the y axis', () => {
      expect(stub.withArgs('y').calledWith('y', mockYDomainRange, mockData, mockYType, mockH)).to.be.true;
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
      expect(p).to.deep.equal({
        node: mockNode,
        root: mockRoot,
        w: mockW,
        h: mockH,
        x: mockX,
        y: mockY,
        m: mockM
      });
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
        const chart = TestUtils.renderIntoDocument(<BarChart data={mockData} axisLabels={mockAxisLabels} />);
        chart.createXAxis(p);
      });

      it('creates the x axis', () => {
        expect(mockRoot.append.calledWith('g')).to.be.true;
        expect(mockRoot.attr.calledWith('class', 'x axis')).to.be.true;
        expect(mockRoot.attr.calledWith('transform', 'translate(0, 130)')).to.be.true;
        expect(mockRoot.call.called).to.be.true;
        expect(mockRoot.append.calledWith('text')).to.be.true;
        expect(mockRoot.attr.calledWith('class', 'label')).to.be.true;
        expect(mockRoot.attr.calledWith('y', 40)).to.be.true;
        expect(mockRoot.attr.calledWith('x', mockW)).to.be.true;
        expect(mockRoot.style.calledWith('text-anchor', 'end')).to.be.true;
        expect(mockRoot.text.calledWith('Mock X Label')).to.be.true;
      });
    });

    describe('Y axis orient tp the right hand side (\'yAxisOrientRight\' is \'true\')', () => {
      beforeEach(() => {
        const chart = TestUtils.renderIntoDocument(<BarChart data={mockData} axisLabels={mockAxisLabels} yAxisOrientRight />);
        chart.createXAxis(p);
      });

      it('creates the x axis', () => {
        expect(mockRoot.append.calledWith('g')).to.be.true;
        expect(mockRoot.attr.calledWith('class', 'x axis')).to.be.true;
        expect(mockRoot.attr.calledWith('transform', 'translate(0, 130)')).to.be.true;
        expect(mockRoot.call.called).to.be.true;
        expect(mockRoot.append.calledWith('text')).to.be.true;
        expect(mockRoot.attr.calledWith('class', 'label')).to.be.true;
        expect(mockRoot.attr.calledWith('y', 40)).to.be.true;
        expect(mockRoot.attr.calledWith('x', 0)).to.be.true;
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
        const chart = TestUtils.renderIntoDocument(<BarChart data={mockData} axisLabels={mockAxisLabels} />);
        chart.createYAxis(p);
      });

      it('creates the y axis', () => {
        expect(mockRoot.append.calledWith('g')).to.be.true;
        expect(mockRoot.attr.calledWith('class', 'y axis')).to.be.true;
        expect(mockRoot.attr.calledWith('transform', 'translate(0, 0)')).to.be.true;
        expect(mockRoot.call.called).to.be.true;
        expect(mockRoot.append.calledWith('text')).to.be.true;
        expect(mockRoot.attr.calledWith('class', 'label')).to.be.true;
        expect(mockRoot.attr.calledWith('x', 0)).to.be.true;
        expect(mockRoot.attr.calledWith('y', -40)).to.be.true;
        expect(mockRoot.attr.calledWith('dy', '.9em')).to.be.true;
        expect(mockRoot.style.calledWith('text-anchor', 'end')).to.be.true;
        expect(mockRoot.text.calledWith('Mock Y Label')).to.be.true;
      });
    });

    describe('Y axis orient tp the right hand side (\'yAxisOrientRight\' is \'true\')', () => {
      beforeEach(() => {
        const chart = TestUtils.renderIntoDocument(<BarChart data={mockData} axisLabels={mockAxisLabels} yAxisOrientRight />);
        chart.createYAxis(p);
      });

      it('creates the y axis', () => {
        expect(mockRoot.append.calledWith('g')).to.be.true;
        expect(mockRoot.attr.calledWith('class', 'y axis')).to.be.true;
        expect(mockRoot.attr.calledWith('transform', 'translate(300, 0)')).to.be.true;
        expect(mockRoot.call.called).to.be.true;
        expect(mockRoot.append.calledWith('text')).to.be.true;
        expect(mockRoot.attr.calledWith('class', 'label')).to.be.true;
        expect(mockRoot.attr.calledWith('x', 0)).to.be.true;
        expect(mockRoot.attr.calledWith('y', 25)).to.be.true;
        expect(mockRoot.attr.calledWith('dy', '.9em')).to.be.true;
        expect(mockRoot.style.calledWith('text-anchor', 'end')).to.be.true;
        expect(mockRoot.text.calledWith('Mock Y Label')).to.be.true;
      });
    });
  });

  describe('createBarChart()', () => {
    const p = {
      root: mockRoot,
      w: mockW,
      h: mockH,
      m: mockM,
      x: mockX,
      y: mockY
    };

    beforeEach(() => {
      sinon.spy(mockRoot, 'selectAll');
      sinon.spy(mockRoot, 'data');
      sinon.spy(mockRoot, 'enter');
      sinon.spy(mockRoot, 'append');
      sinon.spy(mockRoot, 'attr');
      sinon.spy(mockRoot, 'style');
      sinon.spy(mockRoot, 'on');

      const chart = TestUtils.renderIntoDocument(<BarChart data={mockData} axisLabels={mockAxisLabels} />);
      chart.createBarChart(p);
    });

    afterEach(() => {
      mockRoot.selectAll.restore();
      mockRoot.data.restore();
      mockRoot.enter.restore();
      mockRoot.append.restore();
      mockRoot.attr.restore();
      mockRoot.style.restore();
      mockRoot.on.restore();
    });

    it('creates the bar chart', () => {
      expect(mockRoot.selectAll.calledWith('.bar')).to.be.true;
      expect(mockRoot.data.calledWith(mockData)).to.be.true;
      expect(mockRoot.enter.called).to.be.true;
      expect(mockRoot.append.calledWith('rect')).to.be.true;
      expect(mockRoot.attr.calledWith('class', 'bar')).to.be.true;
      expect(mockRoot.style.calledWith('fill')).to.be.true;
      expect(mockRoot.attr.calledWith('x')).to.be.true;
      expect(mockRoot.attr.calledWith('width')).to.be.true;
      expect(mockRoot.attr.calledWith('y')).to.be.true;
      expect(mockRoot.attr.calledWith('height')).to.be.true;
      expect(mockRoot.on.calledWith('mouseover')).to.be.true;
      expect(mockRoot.on.calledWith('mouseout')).to.be.true;
      expect(mockRoot.on.calledWith('mousemove')).to.be.true;
      expect(mockRoot.on.calledWith('click')).to.be.true;
    });
  });

  describe('createLinePath()', () => {
    let chart;
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
      sinon.spy(mockRoot, 'datum');
      sinon.spy(mockRoot, 'attr');

      chart = TestUtils.renderIntoDocument(<BarChart data={mockData} lineData={mockLineData} xType={mockXType} y2Type={mockY2Type} yDomainRange={mockYDomainRange} />);
      sinon.spy(chart, 'setScaleDomainRange');
      chart.createLinePath(p);
    });

    afterEach(() => {
      mockRoot.append.restore();
      mockRoot.datum.restore();
      mockRoot.attr.restore();
      chart.setScaleDomainRange.restore();
    });

    it('sets the scale, domain and range of the y axis', () => {
      expect(chart.setScaleDomainRange.calledWith('y', mockYDomainRange, mockLineData, mockY2Type, mockH)).to.be.true;
    });

    it('creates the line path', () => {
      expect(mockRoot.append.calledWith('path')).to.be.true;
      expect(mockRoot.datum.calledWith(mockLineData)).to.be.true;
      expect(mockRoot.attr.calledWith('class', 'line')).to.be.true;
      expect(mockRoot.attr.calledWith('style', 'stroke: red')).to.be.true;
      expect(mockRoot.attr.calledWith('d')).to.be.true;
    });
  });

  describe('Rendering the BarChart', () => {
    describe('Always', () => {
      const renderer = TestUtils.createRenderer();
      renderer.render(<BarChart data={mockData} />);

      const chart = renderer.getRenderOutput();
      const svg = chart.props.children[1];
      const graph = svg.props.children[0];

      it('renders a \'div\' container', () => {
        expect(chart.type).to.equal('div');
      });

      it('renders a \'svg\' child', () => {
        expect(svg.type).to.equal('svg');
      });

      it('renders the graph', () => {
        expect(graph.props.transform).to.equal('translate(0, 0)');
        expect(graph.props.children[0].type).to.equal('rect');
        expect(graph.props.children[1].type).to.equal('rect');
        expect(graph.props.children[2].type).to.equal('rect');
      });
    });

    describe('With optional props', () => {
      const chart = TestUtils.renderIntoDocument(
        <BarChart data={mockData}
          mouseOverHandler={mouseOverSpy}
          mouseOutHandler={mouseOutSpy}
          mouseMoveHandler={mouseMoveSpy}
          clickHandler={clickSpy}
        />
      );
      const domRoot = ReactDOM.findDOMNode(chart);
      const svgNode = domRoot.childNodes[1];
      const barNode = svgNode.childNodes[0].childNodes[1];

      it('responds to click events', () => {
        TestUtils.Simulate.click(barNode);
        expect(clickSpy).to.have.been.called();
      });

      it('responds to mouse over events', () => {
        TestUtils.SimulateNative.mouseOver(barNode);
        expect(mouseOverSpy).to.have.been.called();
      });

      it('responds to mouse out events', () => {
        TestUtils.SimulateNative.mouseOut(barNode);
        expect(mouseOutSpy).to.have.been.called();
      });

      it('responds to mouse move events', () => {
        TestUtils.SimulateNative.mouseMove(barNode);
        expect(mouseMoveSpy).to.have.been.called();
      });
    });
  });
});
