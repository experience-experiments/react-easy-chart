/* eslint-env node, mocha */
/* eslint no-unused-expressions: 0, no-console: 0 */

import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import chai, { expect } from 'chai'; // { should as shouldFactory, expect} from 'chai';
import sinon from 'sinon';
import spies from 'chai-spies';

import { PieChartStatic as PieChart } from 'react-easy-chart';

// const should = chaiShould();

chai.use(spies);

const mockData = [
  { key: 'A', value: 100 },
  { key: 'B', value: 200 },
  { key: 'C', value: 50 }
];

const mockRoot = {
  attr: () => mockRoot,
  append: () => mockRoot,
  enter: () => mockRoot,
  datum: () => mockRoot,
  selectAll: () => mockRoot,
  data: () => mockRoot,
  text: () => mockRoot,
  on: () => mockRoot
};

const mockPath = {
  enter: () => mockPath,
  append: () => mockPath,
  attr: () => mockPath,
  attrTween: () => mockPath,
  on: () => mockPath,
  each: () => mockPath,
  transition: () => mockPath,
  duration: () => mockPath,
  exit: () => mockPath,
  remove: () => mockPath
};

const mockText = {
  enter: () => mockText,
  append: () => mockText,
  attr: () => mockText,
  attrTween: () => mockText,
  text: () => mockText,
  each: () => mockText,
  transition: () => mockText,
  duration: () => mockText,
  exit: () => mockText,
  remove: () => mockText
};

const mockSlice = {
  data: () => true
};

const mockLabel = {
  data: () => true
};

const mockOuterRadius = 200;
// const mockInnerRadius = 100;

const mouseOverSpy = chai.spy(() => {});
const mouseOutSpy = chai.spy(() => {});
const mouseMoveSpy = chai.spy(() => {});
const clickSpy = chai.spy(() => {});

describe('PieChart (Static) component', () => {
  it('should be defined as a function', () => {
    PieChart.should.be.a('function');
  });

  describe('Instantiating the PieChart', () => {
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
          ReactTestUtils.renderIntoDocument(
            <PieChart />
          );
        }).to.throw(Error);
      });
    });
    describe('With required props', () => {
      describe('Always', () => {
        let chart;

        beforeEach(() => {
          sinon.spy(PieChart.prototype, 'render');
          chart = ReactTestUtils.renderIntoDocument(
            <PieChart
              data={mockData}
            />
          );
        });

        afterEach(() => {
          PieChart.prototype.render.restore();
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
         * Creation of 'uid' should be mocked
         */
        it('creates a uid and assigns it to the instance', () => {
          expect(chart.uid).to.not.be.an('undefined');
        });
      });

      describe('Without optional props', () => {
        describe('Consuming the \'defaultProps\'', () => {
          const chart = ReactTestUtils.renderIntoDocument(
            <PieChart
              data={mockData}
            />
          );

          it('has a size for the chart', () => {
            /**
             * Pie Charts must have non-zero size. We
             * default to 400
             */
            expect(chart.props).to.have.property('size', 400);
          });

          it('has a size for the hole in the chart (for \'donut\' shapes)', () => {
            /**
             * Pie Charts can have a size for a "hole" in the middle
             * to form a "donut" shaped chart. We assume there is no hole
             */
            expect(chart.props).to.have.property('innerHoleSize', 0);
          });

          it('has padding between the pie and the chart edge', () => {
            /**
             * We default to padding of 2px
             */
            expect(chart.props).to.have.property('padding', 2);
          });

          it('can render successfully without labels (\'labels\' is \'false\')', () => {
            /**
             * Pie Charts can render without labels. We assume that there are no
             * labels to render unless they are passed to the component!
             */
            expect(chart.props).to.have.property('labels', false);
          });

          it('can render successfully without styles (\'styles\' is \'{}\')', () => {
            /**
             * But we provide default values for the axes types, anyway
             */
            expect(chart.props.styles).to.eql({});
          });

          it('has event handlers for events raised by the chart (no op)', () => {
            /*
             * Pie Charts can raise events. We default to "no op" handlers
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
            sinon.spy(PieChart.prototype, 'createSlices');
            sinon.spy(PieChart.prototype, 'createStyle');
            sinon.spy(PieChart.prototype, 'createLabels');
            chart = ReactTestUtils.renderIntoDocument(
              <PieChart
                data={mockData}
              />
            );
          });

          afterEach(() => {
            PieChart.prototype.createSlices.restore();
            PieChart.prototype.createStyle.restore();
            PieChart.prototype.createLabels.restore();
          });

          it('creates the pie chart', () => {
            expect(chart.createSlices.called).to.be.true;
          });

          it('creates the <Style /> component', () => {
            expect(chart.createStyle.called).to.be.true;
          });

          it('does not create the labels', () => {
            expect(chart.createLabels.called).to.be.false;
          });
        });
      });

      describe('With optional props', () => {
        describe('\'labels\' is \'true\'', () => {
          let chart;

          beforeEach(() => {
            sinon.spy(PieChart.prototype, 'createLabels');
            chart = ReactTestUtils.renderIntoDocument(
              <PieChart
                data={mockData}
                labels
              />
            );
          });

          afterEach(() => {
            PieChart.prototype.createLabels.restore();
          });

          it('creates the labels', () => {
            expect(chart.createLabels.called).to.be.true;
          });
        });
      });
    });
  });

  describe('createSlices()', () => {
    const mockSliceArc = {};

    const chart = ReactTestUtils.renderIntoDocument(
      <PieChart
        data={mockData}
      />
    );

    beforeEach(() => {
      sinon.spy(mockRoot, 'append');
      sinon.spy(mockRoot, 'attr');
      sinon.spy(mockRoot, 'datum');
      sinon.spy(mockRoot, 'enter');
      sinon.spy(mockRoot, 'selectAll');
      sinon.spy(mockRoot, 'data');
      sinon.spy(mockRoot, 'on');

      sinon.stub(chart, 'getOuterRadius').returns(mockOuterRadius);
      sinon.stub(chart, 'getSliceArc').returns(mockSliceArc);

      chart.uid = 'mock-uid';
      chart.createSlices({ root: mockRoot });
    });

    afterEach(() => {
      mockRoot.append.restore();
      mockRoot.attr.restore();
      mockRoot.datum.restore();
      mockRoot.enter.restore();
      mockRoot.selectAll.restore();
      mockRoot.data.restore();
      mockRoot.on.restore();

      chart.getOuterRadius.restore();
      chart.getSliceArc.restore();
    });

    it('selects the group and binds the data', () => {
      expect(mockRoot.append.calledWith('g')).to.be.true;
      expect(mockRoot.attr.calledWith('transform', 'translate(200, 200)')).to.be.true;
      expect(mockRoot.datum.calledWith(mockData)).to.be.true;
      expect(mockRoot.selectAll.calledWith('path')).to.be.true;
      expect(mockRoot.data.called).to.be.true;
    });

    it('creates the slices', () => {
      expect(mockRoot.enter.called).to.be.true;
      expect(mockRoot.append.calledWith('path')).to.be.true;
      expect(mockRoot.attr.calledWith('class', 'pie-chart-slice')).to.be.true;
      expect(mockRoot.attr.calledWith('fill')).to.be.true;
      expect(mockRoot.attr.calledWith('d', mockSliceArc)).to.be.true;
      expect(mockRoot.on.calledWith('mouseover')).to.be.true;
      expect(mockRoot.on.calledWith('mouseout')).to.be.true;
      expect(mockRoot.on.calledWith('mousemove')).to.be.true;
      expect(mockRoot.on.calledWith('click')).to.be.true;
    });
  });

  describe('createLabels()', () => {
    /*
     * 'getLabelArc()' behind an arrow function
     */

    const chart = ReactTestUtils.renderIntoDocument(
      <PieChart
        data={mockData}
      />
    );

    beforeEach(() => {
      sinon.spy(mockRoot, 'append');
      sinon.spy(mockRoot, 'attr');
      sinon.spy(mockRoot, 'datum');
      sinon.spy(mockRoot, 'enter');
      sinon.spy(mockRoot, 'selectAll');
      sinon.spy(mockRoot, 'data');
      sinon.spy(mockRoot, 'text');

      sinon.stub(chart, 'getOuterRadius').returns(mockOuterRadius);

      chart.uid = 'mock-uid';
      chart.createLabels({ root: mockRoot });
    });

    afterEach(() => {
      mockRoot.append.restore();
      mockRoot.attr.restore();
      mockRoot.datum.restore();
      mockRoot.enter.restore();
      mockRoot.selectAll.restore();
      mockRoot.data.restore();
      mockRoot.text.restore();

      chart.getOuterRadius.restore();
    });

    it('selects the group and binds the data', () => {
      expect(mockRoot.append.calledWith('g')).to.be.true;
      expect(mockRoot.attr.calledWith('transform', 'translate(200, 200)')).to.be.true;
      expect(mockRoot.datum.calledWith(mockData)).to.be.true;
      expect(mockRoot.selectAll.calledWith('text')).to.be.true;
      expect(mockRoot.data.called).to.be.true;
    });

    it('creates the label', () => {
      expect(mockRoot.enter.called).to.be.true;
      expect(mockRoot.append.calledWith('text')).to.be.true;
      expect(mockRoot.attr.calledWith('class', 'pie-chart-label')).to.be.true;
      expect(mockRoot.attr.calledWith('dy', '.35em')).to.be.true;
      expect(mockRoot.attr.calledWith('transform')).to.be.true;
      expect(mockRoot.text.called).to.be.true;
    });
  });

  describe('Rendering the PieChart', () => {
    describe('Always', () => {
      const renderer = ReactTestUtils.createRenderer();
      renderer.render(
        <PieChart
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
        expect(group.props.transform).to.equal('translate(200, 200)');
      });
    });

    describe('With optional props', () => {
      const chart = ReactTestUtils.renderIntoDocument(
        <PieChart
          data={mockData}
          mouseOverHandler={mouseOverSpy}
          mouseOutHandler={mouseOutSpy}
          mouseMoveHandler={mouseMoveSpy}
          clickHandler={clickSpy}
        />
      );
      const domRoot = ReactDOM.findDOMNode(chart);
      const svgNode = domRoot.childNodes[1];
      const pieNode = svgNode.childNodes[0].childNodes[0];

      it('responds to click events', () => {
        ReactTestUtils.Simulate.click(pieNode);
        expect(clickSpy).to.have.been.called();
      });

      it('responds to mouse over events', () => {
        ReactTestUtils.SimulateNative.mouseOver(pieNode);
        expect(mouseOverSpy).to.have.been.called();
      });

      it('responds to mouse out events', () => {
        ReactTestUtils.SimulateNative.mouseOut(pieNode);
        expect(mouseOutSpy).to.have.been.called();
      });

      it('responds to mouse move events', () => {
        ReactTestUtils.SimulateNative.mouseMove(pieNode);
        expect(mouseMoveSpy).to.have.been.called();
      });
    });
  });
});
