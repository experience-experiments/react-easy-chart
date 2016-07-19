/* eslint-env node, mocha */
/* eslint no-unused-expressions: 0, no-console: 0, max-len: 0 */

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react/lib/ReactTestUtils';
import chai, { expect } from 'chai'; // { should as shouldFactory, expect } from 'chai';
import sinon from 'sinon';
import spies from 'chai-spies';
import { ScatterplotChart } from 'react-easy-chart';

// const should = shouldFactory();

chai.use(spies);

const mockAxisLabels = {
  x: 'Mock X Label',
  y: 'Mock Y Label'
};

const mockW = 320;
const mockInnerW = 300;
const mockH = 180;
const mockInnerH = 150;
const mockM = {
  top: 10,
  right: 10,
  bottom: 10,
  left: 10
};
const mockX = {};
const mockY = {};
const mockNode = { setAttribute: () => mockNode };
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
const mockDotRadius = 5;
const mockXType = 'linear';
const mockYType = 'linear';
const mockConfig = [];

const mockXDomainRange = null;
const mockYDomainRange = null;

const mouseOverSpy = chai.spy(() => {});
const mouseOutSpy = chai.spy(() => {});
const mouseMoveSpy = chai.spy(() => {});
const clickSpy = chai.spy(() => {});

const mockData = [
  { key: 'A', value: 0.5 },
  { key: 'B', value: 0.2 },
  { key: 'C', value: 0.1 }
];

describe('ScatterplotChart component', () => {
  it('should be defined as a function', () => {
    ScatterplotChart.should.be.a('function');
  });

  describe('Instantiating the ScatterplotChart', () => {
    describe('Without required props', () => {
      beforeEach(() => {
        sinon.stub(console, 'error', (e) => {
          throw new Error(e);
        });
      });

      afterEach(() => {
        console.error.restore();
      });

      it('throws an \'Error\'', () => {
        expect(() => {
          TestUtils.renderIntoDocument(
            <ScatterplotChart />
          );
        }).to.throw(Error);
      });
    });

    describe('With required props', () => {
      describe('Always', () => {
        let chart;

        beforeEach(() => {
          sinon.spy(ScatterplotChart.prototype, 'render');
          chart = TestUtils.renderIntoDocument(
            <ScatterplotChart
              data={mockData}
            />
          );
        });

        afterEach(() => {
          ScatterplotChart.prototype.render.restore();
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
            <ScatterplotChart
              data={mockData}
            />
          );

          it('has a width and height for the chart', () => {
            /**
             * Scatterplot Charts must have non-zero width and height. We
             * default to 400 x 300
             */
            expect(chart.props).to.have.property('width', mockW); // 320
            expect(chart.props).to.have.property('height', mockH); // 180
          });

          it('has a pattern for formatting dates on the chart', () => {
            /**
             * We provide a pattern for formatting dates
             */
            expect(chart.props).to.have.property('datePattern', '%d-%b-%y');
          });

          it('has a radius for each point on the chart', () => {
            /**
             * Scatterplot Chart points must have non-zero radius
             */
            expect(chart.props).to.have.property('dotRadius', mockDotRadius);
          });

          it('has a config array for describing points on the chart', () => {
            /**
             * An array of objects with optional keys 'type', 'color' and 'stroke'
             */
            expect(chart.props.config).to.eql(mockConfig);
          });

          it('can render successfully without axes (\'axes\' is \'false\')', () => {
            /**
             * Scatterplot Charts can render without x and y axes. We assume that there are no
             * axes to render unless they are passed to the component!
             */
            expect(chart.props).to.have.property('axes', false);
          });

          it('can render successfully without grid (\'grid\' is \'false\')', () => {
            /**
             * Scatterplot Charts can render a grid. We assume that there is no
             * grid to render!
             */
            expect(chart.props).to.have.property('grid', false);
          });

          it('has types for the axes (\'axes\' is \'true\' but types are unspecified)', () => {
            /**
             * But we provide default values for the axes types, anyway
             */
            expect(chart.props).to.have.property('xType', mockXType); // 'linear'
            expect(chart.props).to.have.property('yType', mockYType); // 'linear'
          });

          it('has labels for the axes (\'axes\' is \'true\' but their labels are unspecified)', () => {
            /**
             * Scatterplot Charts can render without axis labels. We default to
             * empty strings
             */
            expect(chart.props).to.have.deep.property('axisLabels.x');
            expect(chart.props.axisLabels.x).to.have.lengthOf(0);
            expect(chart.props).to.have.deep.property('axisLabels.y');
            expect(chart.props.axisLabels.y).to.have.lengthOf(0);
          });

          it('has event handlers for events raised by the chart (no op)', () => {
            /*
             * Scatterplot Charts can raise events. We default to "no op" handlers
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
            sinon.spy(ScatterplotChart.prototype, 'calculateChartParameters');
            sinon.spy(ScatterplotChart.prototype, 'createXAxis');
            sinon.spy(ScatterplotChart.prototype, 'createYAxis');
            sinon.spy(ScatterplotChart.prototype, 'createScatterplotChart');
            sinon.spy(ScatterplotChart.prototype, 'createStyle');
            chart = TestUtils.renderIntoDocument(
              <ScatterplotChart
                data={mockData}
              />
            );
          });

          afterEach(() => {
            ScatterplotChart.prototype.calculateChartParameters.restore();
            ScatterplotChart.prototype.createXAxis.restore();
            ScatterplotChart.prototype.createYAxis.restore();
            ScatterplotChart.prototype.createScatterplotChart.restore();
            ScatterplotChart.prototype.createStyle.restore();
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

          it('creates the scatterplot chart', () => {
            expect(chart.createScatterplotChart.called).to.be.true;
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
              sinon.spy(ScatterplotChart.prototype, 'createXAxis');
              sinon.spy(ScatterplotChart.prototype, 'createYAxis');
              chart = TestUtils.renderIntoDocument(
                <ScatterplotChart
                  data={mockData}
                  axes
                />
              );
            });

            afterEach(() => {
              ScatterplotChart.prototype.createXAxis.restore();
              ScatterplotChart.prototype.createYAxis.restore();
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
    let stub;
    let p;

    beforeEach(() => {
      chart = TestUtils.renderIntoDocument(
        <ScatterplotChart
          data={mockData}
        />
      );
      stub = sinon.stub(chart, 'createDomainRangeGenerator');
      stub.withArgs('x').returns(mockX);
      stub.withArgs('y').returns(mockY);
      p = chart.calculateChartParameters();
      sinon.stub(chart, 'calculateInnerW').returns(mockInnerW); // 300
      sinon.stub(chart, 'calculateInnerH').returns(mockInnerH); // 150
    });

    afterEach(() => {
      chart.createDomainRangeGenerator.restore();
    });

    it('sets the scale, domain and range of the x axis', () => {
      expect(stub.withArgs('x').calledWith('x', mockXDomainRange, mockData, mockXType, mockInnerW)).to.be.true;
    });

    it('sets the scale, domain and range of the y axis', () => {
      expect(stub.withArgs('y').calledWith('y', mockYDomainRange, mockData, mockYType, mockInnerH)).to.be.true;
    });

    it('returns the parameters as an object', () => {
      expect(p.m).to.eql(mockM);
      expect(p).to.have.property('w', mockW);
      expect(p).to.have.property('h', mockH + (mockDotRadius * 3));
      expect(p).to.have.property('x', mockX);
      expect(p).to.have.property('y', mockY);
      expect(p.node).to.be.an('object');
    });
  });

  describe('createXAxis()', () => {
    const p = {
      m: mockM,
      w: mockW,
      h: mockH,
      x: mockX,
      y: mockY,
      innerH: mockInnerH,
      innerW: mockInnerW,
      root: mockRoot
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
      describe('Always', () => {
        beforeEach(() => {
          const chart = TestUtils.renderIntoDocument(
            <ScatterplotChart
              data={mockData}
            />
          );
          chart.uid = 'mock-uid';
          chart.createXAxis(p);
        });

        it('creates the x axis', () => {
          expect(mockRoot.append.calledWith('g')).to.be.true;
          expect(mockRoot.attr.calledWith('class', 'x axis')).to.be.true;
          expect(mockRoot.attr.calledWith('id', 'scatterplot-x-axis-mock-uid')).to.be.true;
          expect(mockRoot.attr.calledWith('transform', 'translate(0, 150)')).to.be.true;
        });
      });

      describe('With axis labels', () => {
        beforeEach(() => {
          const chart = TestUtils.renderIntoDocument(
            <ScatterplotChart
              data={mockData}
              axisLabels={mockAxisLabels}
            />
          );
          chart.uid = 'mock-uid';
          chart.createXAxis(p);
        });

        it('creates the x label', () => {
          expect(mockRoot.append.calledWith('text')).to.be.true;
          expect(mockRoot.attr.calledWith('class', 'label')).to.be.true;
          expect(mockRoot.attr.calledWith('x', mockInnerW)).to.be.true;
          expect(mockRoot.attr.calledWith('y', 28)).to.be.true;
          expect(mockRoot.style.calledWith('text-anchor', 'end')).to.be.true;
          expect(mockRoot.text.calledWith('Mock X Label')).to.be.true;
        });
      });
    });

    describe('Y axis orient to the right hand side (\'yAxisOrientRight\' is \'true\')', () => {
      describe('Always', () => {
        beforeEach(() => {
          const chart = TestUtils.renderIntoDocument(
            <ScatterplotChart
              data={mockData}
              yAxisOrientRight
            />
          );
          chart.uid = 'mock-uid';
          chart.createXAxis(p);
        });

        it('creates the x axis', () => {
          expect(mockRoot.append.calledWith('g')).to.be.true;
          expect(mockRoot.attr.calledWith('class', 'x axis')).to.be.true;
          expect(mockRoot.attr.calledWith('id', 'scatterplot-x-axis-mock-uid')).to.be.true;
          expect(mockRoot.attr.calledWith('transform', 'translate(0, 150)')).to.be.true;
        });
      });

      describe('With optional props', () => {
        beforeEach(() => {
          const chart = TestUtils.renderIntoDocument(
            <ScatterplotChart
              data={mockData}
              axisLabels={mockAxisLabels}
              yAxisOrientRight
            />
          );
          chart.uid = 'mock-uid';
          chart.createXAxis(p);
        });

        it('creates the x axis', () => {
          expect(mockRoot.append.calledWith('text')).to.be.true;
          expect(mockRoot.attr.calledWith('class', 'label')).to.be.true;
          expect(mockRoot.attr.calledWith('x', 0)).to.be.true;
          expect(mockRoot.attr.calledWith('y', 28)).to.be.true;
          expect(mockRoot.style.calledWith('text-anchor', 'start')).to.be.true;
          expect(mockRoot.text.calledWith('Mock X Label')).to.be.true;
        });
      });
    });
  });

  describe('createYAxis()', () => {
    const p = {
      m: mockM,
      w: mockW,
      h: mockH,
      x: mockX,
      y: mockY,
      innerW: mockInnerW,
      innerH: mockInnerH,
      root: mockRoot
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
      describe('Always', () => {
        beforeEach(() => {
          const chart = TestUtils.renderIntoDocument(
            <ScatterplotChart
              data={mockData}
            />
          );
          chart.uid = 'mock-uid';
          chart.createYAxis(p);
        });

        it('creates the y axis', () => {
          expect(mockRoot.append.calledWith('g')).to.be.true;
          expect(mockRoot.attr.calledWith('class', 'y axis')).to.be.true;
          expect(mockRoot.attr.calledWith('id', 'scatterplot-y-axis-mock-uid')).to.be.true;
          expect(mockRoot.attr.calledWith('transform', 'translate(0, 0)')).to.be.true;
        });
      });

      describe('With optional props', () => {
        beforeEach(() => {
          const chart = TestUtils.renderIntoDocument(
            <ScatterplotChart
              data={mockData}
              axisLabels={mockAxisLabels}
            />
          );
          chart.uid = 'mock-uid';
          chart.createYAxis(p);
        });

        it('creates the y axis', () => {
          expect(mockRoot.append.calledWith('text')).to.be.true;
          expect(mockRoot.attr.calledWith('class', 'label')).to.be.true;
          expect(mockRoot.attr.calledWith('transform', 'rotate(-90)')).to.be.true;
          expect(mockRoot.attr.calledWith('y', 0)).to.be.true;
          expect(mockRoot.attr.calledWith('dy', '.71em')).to.be.true;
          expect(mockRoot.style.calledWith('text-anchor', 'end')).to.be.true;
          expect(mockRoot.text.calledWith('Mock Y Label')).to.be.true;
        });
      });
    });

    describe('Y axis orient to the right hand side (\'yAxisOrientRight\' is \'true\')', () => {
      describe('Always', () => {
        beforeEach(() => {
          const chart = TestUtils.renderIntoDocument(
            <ScatterplotChart
              data={mockData}
              axisLabels={mockAxisLabels}
              yAxisOrientRight
            />
          );
          chart.uid = 'mock-uid';
          chart.createYAxis(p);
        });

        it('creates the y axis', () => {
          expect(mockRoot.append.calledWith('g')).to.be.true;
          expect(mockRoot.attr.calledWith('class', 'y axis')).to.be.true;
          expect(mockRoot.attr.calledWith('id', 'scatterplot-y-axis-mock-uid')).to.be.true;
          expect(mockRoot.attr.calledWith('transform', 'translate(300, 0)')).to.be.true;
        });
      });

      describe('With axis labels', () => {
        beforeEach(() => {
          const chart = TestUtils.renderIntoDocument(
            <ScatterplotChart
              data={mockData}
              axisLabels={mockAxisLabels}
              yAxisOrientRight
            />
          );
          chart.uid = 'mock-uid';
          chart.createYAxis(p);
        });

        it('creates the y axis', () => {
          expect(mockRoot.append.calledWith('text')).to.be.true;
          expect(mockRoot.attr.calledWith('class', 'label')).to.be.true;
          expect(mockRoot.attr.calledWith('transform', 'rotate(-90)')).to.be.true;
          expect(mockRoot.attr.calledWith('y', -15)).to.be.true;
          expect(mockRoot.attr.calledWith('dy', '.71em')).to.be.true;
          expect(mockRoot.style.calledWith('text-anchor', 'end')).to.be.true;
          expect(mockRoot.text.calledWith('Mock Y Label')).to.be.true;
        });
      });
    });
  });

  describe('createScatterplotChart()', () => {
    const p = {
      m: mockM,
      w: mockW,
      h: mockH,
      x: mockX,
      y: mockY,
      node: mockNode,
      root: mockRoot
    };

    beforeEach(() => {
      sinon.spy(mockNode, 'setAttribute');
      sinon.spy(mockRoot, 'append');
      sinon.spy(mockRoot, 'attr');

      const chart = TestUtils.renderIntoDocument(
        <ScatterplotChart
          data={mockData}
          axisLabels={mockAxisLabels}
        />
      );
      chart.uid = 'mock-uid';
      chart.createScatterplotChart(p);
    });

    afterEach(() => {
      mockRoot.append.restore();
      mockRoot.attr.restore();
    });

    it('creates the scatterplot chart', () => {
      expect(mockRoot.append.calledWith('g')).to.be.true;
      expect(mockRoot.attr.calledWith('id', 'scatterplot-chart-mock-uid')).to.be.true;
    });
  });

  describe('initialise()', () => {
    beforeEach(() => {
      sinon.spy(ScatterplotChart.prototype, 'calculateChartParameters');
      sinon.spy(ScatterplotChart.prototype, 'initialiseXAxis');
      sinon.spy(ScatterplotChart.prototype, 'initialiseYAxis');
      sinon.spy(ScatterplotChart.prototype, 'initialiseChart');
    });

    afterEach(() => {
      ScatterplotChart.prototype.calculateChartParameters.restore();
      ScatterplotChart.prototype.initialiseXAxis.restore();
      ScatterplotChart.prototype.initialiseYAxis.restore();
      ScatterplotChart.prototype.initialiseChart.restore();
    });

    describe('Always', () => {
      let chart;

      beforeEach(() => {
        chart = TestUtils.renderIntoDocument(
          <ScatterplotChart
            data={mockData}
          />
        );
        chart.initialise();
      });

      it('calculates the chart parameters', () => {
        expect(chart.calculateChartParameters.called).to.be.true;
      });

      it('does not initialise the x axis (\'axes\' is \'false\')', () => {
        expect(chart.initialiseXAxis.called).to.be.false;
      });

      it('does not initialise the y axis (\'axes\' is \'false\')', () => {
        expect(chart.initialiseYAxis.called).to.be.false;
      });

      it('initialises the chart', () => {
        expect(chart.initialiseChart.called).to.be.true;
      });
    });

    describe('With optional props', () => {
      describe('\'axes\' is \'true\'', () => {
        let chart;

        beforeEach(() => {
          chart = TestUtils.renderIntoDocument(
            <ScatterplotChart
              data={mockData}
              axes
            />
          );
          chart.initialise();
        });

        it('initialises the x axis (\'axes\' is \'true\')', () => {
          expect(chart.initialiseXAxis.called).to.be.true;
        });

        it('initialises the y axis (\'axes\' is \'true\')', () => {
          expect(chart.initialiseYAxis.called).to.be.true;
        });
      });
    });
  });

  describe('initialiseXAxis()', () => {
    const mockXAxis = {
      call: () => true
    };

    const mockXAxisGenerator = () => true;

    const chart = TestUtils.renderIntoDocument(
      <ScatterplotChart
        data={mockData}
        axes
      />
    );

    it('initialises the x axis', () => {
      sinon.spy(mockXAxis, 'call');
      sinon.stub(chart, 'getXAxis').returns(mockXAxis);
      chart.initialiseXAxis({ xAxis: mockXAxisGenerator });
      expect(mockXAxis.call
        .calledWith(mockXAxisGenerator)
      ).to.be.true;
    });
  });

  describe('initialiseYAxis()', () => {
    const mockYAxis = {
      call: () => true
    };

    const mockYAxisGenerator = () => true;

    const chart = TestUtils.renderIntoDocument(
      <ScatterplotChart
        data={mockData}
        axes
      />
    );

    it('initialises the y axis', () => {
      sinon.spy(mockYAxis, 'call');
      sinon.stub(chart, 'getYAxis').returns(mockYAxis);
      chart.initialiseYAxis({ yAxis: mockYAxisGenerator });
      expect(mockYAxis.call
        .calledWith(mockYAxisGenerator)
      ).to.be.true;
    });
  });

  describe('initialiseChart()', () => {
    const mockCircle = {
      enter: () => mockCircle,
      append: () => mockCircle,
      attr: () => mockCircle,
      style: () => mockCircle,
      on: () => mockCircle
    };

    const mockCircles = {
      data: () => true
    };

    const chart = TestUtils.renderIntoDocument(
      <ScatterplotChart
        data={mockData}
        axes
      />
    );

    beforeEach(() => {
      sinon.spy(mockCircle, 'enter');
      sinon.spy(mockCircle, 'append');
      sinon.spy(mockCircle, 'attr');
      sinon.spy(mockCircle, 'style');
      sinon.spy(mockCircle, 'on');
      sinon.stub(mockCircles, 'data').returns(mockCircle);
      sinon.stub(chart, 'getCircles').returns(mockCircles);
      chart.initialiseChart({ x: mockX, y: mockY });
    });

    afterEach(() => {
      mockCircle.enter.restore();
      mockCircle.append.restore();
      mockCircle.attr.restore();
      mockCircle.style.restore();
      mockCircle.on.restore();
      mockCircles.data.restore();
      chart.getCircles.restore();
    });

    it('binds the data', () => {
      expect(mockCircles.data
        .calledWith(mockData)
      ).to.be.true;
    });

    it('initialises the chart', () => {
      expect(mockCircle.enter.called).to.be.true;
      expect(mockCircle.append.calledWith('circle')).to.be.true;
      expect(mockCircle.attr.calledWith('class', 'dot')).to.be.true;
      expect(mockCircle.attr.calledWith('r')).to.be.true;
      expect(mockCircle.attr.calledWith('cx')).to.be.true;
      expect(mockCircle.attr.calledWith('cy')).to.be.true;
      expect(mockCircle.style.calledWith('fill')).to.be.true;
      expect(mockCircle.style.calledWith('stroke')).to.be.true;
      expect(mockCircle.on.calledWith('mouseover')).to.be.true;
      expect(mockCircle.on.calledWith('mouseout')).to.be.true;
      expect(mockCircle.on.calledWith('mousemove')).to.be.true;
      expect(mockCircle.on.calledWith('click')).to.be.true;
    });
  });

  describe('transition()', () => {
    beforeEach(() => {
      sinon.spy(ScatterplotChart.prototype, 'calculateChartParameters');
      sinon.spy(ScatterplotChart.prototype, 'transitionXAxis');
      sinon.spy(ScatterplotChart.prototype, 'transitionYAxis');
      sinon.spy(ScatterplotChart.prototype, 'transitionChart');
    });

    afterEach(() => {
      ScatterplotChart.prototype.calculateChartParameters.restore();
      ScatterplotChart.prototype.transitionXAxis.restore();
      ScatterplotChart.prototype.transitionYAxis.restore();
      ScatterplotChart.prototype.transitionChart.restore();
    });

    describe('Always', () => {
      let chart;

      beforeEach(() => {
        chart = TestUtils.renderIntoDocument(
          <ScatterplotChart
            data={mockData}
          />
        );
        chart.transition();
      });

      it('calculates the chart parameters', () => {
        expect(chart.calculateChartParameters.called).to.be.true;
      });

      it('does not transition the x axis (\'axes\' is \'false\')', () => {
        expect(chart.transitionXAxis.called).to.be.false;
      });

      it('does not transition the y axis (\'axes\' is \'false\')', () => {
        expect(chart.transitionYAxis.called).to.be.false;
      });

      it('transitions the chart', () => {
        expect(chart.transitionChart.called).to.be.true;
      });
    });

    describe('With optional props', () => {
      describe('\'axes\' is \'true\'', () => {
        let chart;

        beforeEach(() => {
          chart = TestUtils.renderIntoDocument(
            <ScatterplotChart
              data={mockData}
              axes
            />
          );
          chart.transition();
        });

        it('transitions the x axis (\'axes\' is \'true\')', () => {
          expect(chart.transitionXAxis.called).to.be.true;
        });

        it('transitions the y axis (\'axes\' is \'true\')', () => {
          expect(chart.transitionYAxis.called).to.be.true;
        });
      });
    });
  });

  describe('transitionXAxis()', () => {
    const mockXAxis = {
      transition: () => mockXAxis,
      duration: () => mockXAxis,
      call: () => true
    };

    const mockXAxisGenerator = () => true;

    const chart = TestUtils.renderIntoDocument(
      <ScatterplotChart
        data={mockData}
        axes
      />
    );

    beforeEach(() => {
      sinon.spy(mockXAxis, 'transition');
      sinon.spy(mockXAxis, 'duration');
      sinon.spy(mockXAxis, 'call');
      sinon.stub(chart, 'getXAxis').returns(mockXAxis);
      chart.transitionXAxis({ xAxis: mockXAxisGenerator });
    });

    afterEach(() => {
      mockXAxis.transition.restore();
      mockXAxis.duration.restore();
      mockXAxis.call.restore();
      chart.getXAxis.restore();
    });

    it('defines the transition', () => {
      expect(mockXAxis.transition
        .called
      ).to.be.true;
      expect(mockXAxis.duration
        .calledWith(750)
      ).to.be.true;
    });

    it('transitions the x axis', () => {
      expect(mockXAxis.call
        .calledWith(mockXAxisGenerator)
      ).to.be.true;
    });
  });

  describe('transitionYAxis()', () => {
    const mockYAxis = {
      transition: () => mockYAxis,
      duration: () => mockYAxis,
      call: () => true
    };

    const mockYAxisGenerator = () => true;

    const chart = TestUtils.renderIntoDocument(
      <ScatterplotChart
        data={mockData}
        axes
      />
    );

    beforeEach(() => {
      sinon.spy(mockYAxis, 'transition');
      sinon.spy(mockYAxis, 'duration');
      sinon.spy(mockYAxis, 'call');
      sinon.stub(chart, 'getYAxis').returns(mockYAxis);
      chart.transitionYAxis({ yAxis: mockYAxisGenerator });
    });

    afterEach(() => {
      mockYAxis.transition.restore();
      mockYAxis.duration.restore();
      mockYAxis.call.restore();
      chart.getYAxis.restore();
    });

    it('defines the transition', () => {
      expect(mockYAxis.transition
        .called
      ).to.be.true;
      expect(mockYAxis.duration
        .calledWith(750)
      ).to.be.true;
    });

    it('transitions the y axis', () => {
      expect(mockYAxis.call
        .calledWith(mockYAxisGenerator)
      ).to.be.true;
    });
  });

  describe('transitionChart()', () => {
    const mockCircle = {
      transition: () => mockCircle,
      duration: () => mockCircle,
      enter: () => mockCircle,
      append: () => mockCircle,
      attr: () => mockCircle,
      style: () => mockCircle,
      on: () => mockCircle,
      exit: () => mockCircle,
      remove: () => mockCircle
    };

    const mockCircles = {
      data: () => true
    };

    const chart = TestUtils.renderIntoDocument(
      <ScatterplotChart
        data={mockData}
        axes
      />
    );

    beforeEach(() => {
      sinon.spy(mockCircle, 'transition');
      sinon.spy(mockCircle, 'duration');
      sinon.spy(mockCircle, 'enter');
      sinon.spy(mockCircle, 'append');
      sinon.spy(mockCircle, 'attr');
      sinon.spy(mockCircle, 'style');
      sinon.spy(mockCircle, 'on');
      sinon.spy(mockCircle, 'exit');
      sinon.spy(mockCircle, 'remove');
      sinon.stub(mockCircles, 'data').returns(mockCircle);
      sinon.stub(chart, 'getCircles').returns(mockCircles);
      chart.transitionChart({ x: mockX, y: mockY });
    });

    afterEach(() => {
      mockCircle.transition.restore();
      mockCircle.duration.restore();
      mockCircle.enter.restore();
      mockCircle.append.restore();
      mockCircle.attr.restore();
      mockCircle.style.restore();
      mockCircle.on.restore();
      mockCircle.exit.restore();
      mockCircle.remove.restore();
      mockCircles.data.restore();
      chart.getCircles.restore();
    });

    it('binds the data', () => {
      expect(mockCircles.data
        .calledWith(mockData)
      ).to.be.true;
    });

    it('defines the transition', () => {
      expect(mockCircle.transition
        .called
      ).to.be.true;
      expect(mockCircle.duration
        .calledWith(750)
      ).to.be.true;
    });

    it('transitions the chart', () => {
      expect(mockCircle.enter.called).to.be.true;
      expect(mockCircle.append.calledWith('circle')).to.be.true;
      expect(mockCircle.attr.calledWith('class', 'dot')).to.be.true;
      expect(mockCircle.attr.calledWith('r')).to.be.true;
      expect(mockCircle.attr.calledWith('cx')).to.be.true;
      expect(mockCircle.attr.calledWith('cy')).to.be.true;
      expect(mockCircle.style.calledWith('fill')).to.be.true;
      expect(mockCircle.style.calledWith('stroke')).to.be.true;
      expect(mockCircle.on.calledWith('mouseover')).to.be.true;
      expect(mockCircle.on.calledWith('mouseout')).to.be.true;
      expect(mockCircle.on.calledWith('mousemove')).to.be.true;
      expect(mockCircle.on.calledWith('click')).to.be.true;
    });
  });

  describe('Rendering the ScatterplotChart', () => {
    describe('Always', () => {
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <ScatterplotChart
          data={mockData}
        />
      );

      const chart = renderer.getRenderOutput();
      const svg = chart.props.children[1];
      const group = svg.props.children[0];

      it('renders a <div /> container', () => {
        expect(chart.type).to.equal('div');
      });

      it('renders a <svg /> child', () => {
        expect(svg.type).to.equal('svg');
      });

      it('renders the group', () => {
        expect(group.props.transform).to.equal('translate(10, 10)');
      });
    });

    describe('With optional props', () => {
      describe('initialise()', () => {
        const chart = TestUtils.renderIntoDocument(
          <ScatterplotChart
            data={mockData}
            axes
            mouseOverHandler={mouseOverSpy}
            mouseOutHandler={mouseOutSpy}
            mouseMoveHandler={mouseMoveSpy}
            clickHandler={clickSpy}
          />
        );

        chart.initialise();

        const domRoot = ReactDOM.findDOMNode(chart);
        const svgNode = domRoot.childNodes[1];
        const circleNode = svgNode
          .childNodes[0]
          .childNodes[2]
          .childNodes[0];

        xit('responds to click events', () => {
          TestUtils.Simulate.click(circleNode);
          expect(clickSpy).to.have.been.called();
        });

        xit('responds to mouse over events', () => {
          TestUtils.SimulateNative.mouseOver(circleNode);
          expect(mouseOverSpy).to.have.been.called();
        });

        xit('responds to mouse out events', () => {
          TestUtils.SimulateNative.mouseOut(circleNode);
          expect(mouseOutSpy).to.have.been.called();
        });

        xit('responds to mouse move events', () => {
          TestUtils.SimulateNative.mouseMove(circleNode);
          expect(mouseMoveSpy).to.have.been.called();
        });
      });

      describe('transition()', () => {
        const chart = TestUtils.renderIntoDocument(
          <ScatterplotChart
            data={mockData}
            axes
            mouseOverHandler={mouseOverSpy}
            mouseOutHandler={mouseOutSpy}
            mouseMoveHandler={mouseMoveSpy}
            clickHandler={clickSpy}
          />
        );

        chart.transition();

        const domRoot = ReactDOM.findDOMNode(chart);
        const svgNode = domRoot.childNodes[1];
        const circleNode = svgNode
          .childNodes[0]
          .childNodes[2]
          .childNodes[0];

        xit('responds to click events', () => {
          TestUtils.Simulate.click(circleNode);
          expect(clickSpy).to.have.been.called();
        });

        xit('responds to mouse over events', () => {
          TestUtils.SimulateNative.mouseOver(circleNode);
          expect(mouseOverSpy).to.have.been.called();
        });

        xit('responds to mouse out events', () => {
          TestUtils.SimulateNative.mouseOut(circleNode);
          expect(mouseOutSpy).to.have.been.called();
        });

        xit('responds to mouse move events', () => {
          TestUtils.SimulateNative.mouseMove(circleNode);
          expect(mouseMoveSpy).to.have.been.called();
        });
      });
    });
  });
});
