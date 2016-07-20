/* eslint-env node, mocha */
/* eslint no-unused-expressions: 0, no-console: 0 */

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react/lib/ReactTestUtils';
import chai, { expect } from 'chai'; // { should as shouldFactory, expect} from 'chai';
import sinon from 'sinon';
import spies from 'chai-spies';

import { PieChartHybrid as PieChart } from 'react-easy-chart';

// const should = chaiShould();

chai.use(spies);

const mockData = [
  { key: 'A', value: 100 },
  { key: 'B', value: 200 },
  { key: 'C', value: 50 }
];

const mockRoot = {
  attr: () => mockRoot,
  append: () => mockRoot
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

describe('PieChart (Hybrid) component', () => {
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
          TestUtils.renderIntoDocument(
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
          chart = TestUtils.renderIntoDocument(
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

        /*
         * PieCharts require a pie slice tween method
         */
        it('assigns the method \'tweenSlice\' to the instance', () => {
          expect(chart.tweenSlice).to.be.a('function');
        });

        /*
         * An array for pie slices
         */
        it('assigns the array \'currentSlices\' to the instance', () => {
          expect(chart.currentSlices).to.be.a('array');
        });

        /*
         * An array for pie labels
         */
        it('assigns the array \'currentLabels\' to the instance', () => {
          expect(chart.currentLabels).to.be.a('array');
        });
      });

      describe('Without optional props', () => {
        describe('Consuming the \'defaultProps\'', () => {
          const chart = TestUtils.renderIntoDocument(
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
            chart = TestUtils.renderIntoDocument(
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
            chart = TestUtils.renderIntoDocument(
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
    const chart = TestUtils.renderIntoDocument(
      <PieChart
        data={mockData}
      />
    );

    beforeEach(() => {
      sinon.spy(mockRoot, 'append');
      sinon.spy(mockRoot, 'attr');

      sinon.stub(chart, 'getOuterRadius').returns(mockOuterRadius);

      chart.uid = 'mock-uid';
      chart.createSlices({ root: mockRoot });
    });

    afterEach(() => {
      mockRoot.append.restore();
      mockRoot.attr.restore();

      chart.getOuterRadius.restore();
    });

    it('creates the slices', () => {
      expect(mockRoot.append.calledWith('g')).to.be.true;
      expect(mockRoot.attr.calledWith('id', 'slices-mock-uid')).to.be.true;
      expect(mockRoot.attr.calledWith('transform', 'translate(200, 200)')).to.be.true;
    });
  });

  describe('createLabels()', () => {
    const chart = TestUtils.renderIntoDocument(
      <PieChart
        data={mockData}
      />
    );

    beforeEach(() => {
      sinon.spy(mockRoot, 'append');
      sinon.spy(mockRoot, 'attr');

      sinon.stub(chart, 'getOuterRadius').returns(mockOuterRadius);

      chart.uid = 'mock-uid';
      chart.createLabels({ root: mockRoot });
    });

    afterEach(() => {
      mockRoot.append.restore();
      mockRoot.attr.restore();

      chart.getOuterRadius.restore();
    });

    it('creates the labels', () => {
      expect(mockRoot.append.calledWith('g')).to.be.true;
      expect(mockRoot.attr.calledWith('id', 'labels-mock-uid')).to.be.true;
      expect(mockRoot.attr.calledWith('transform', 'translate(200, 200)')).to.be.true;
    });
  });

  describe('initialise()', () => {
    beforeEach(() => {
      sinon.spy(PieChart.prototype, 'calculateChartParameters');
      sinon.spy(PieChart.prototype, 'initialiseSlices');
      sinon.spy(PieChart.prototype, 'initialiseLabels');
    });

    afterEach(() => {
      PieChart.prototype.calculateChartParameters.restore();
      PieChart.prototype.initialiseSlices.restore();
      PieChart.prototype.initialiseLabels.restore();
    });

    describe('Always', () => {
      const chart = TestUtils.renderIntoDocument(
        <PieChart
          data={mockData}
        />
      );

      beforeEach(() => {
        chart.initialise();
      });

      it('initialises the slices', () => {
        expect(chart.initialiseSlices.called).to.be.true;
      });

      it('does not initialise the labels (\'labels\' is \'false\')', () => {
        expect(chart.initialiseLabels.called).to.be.false;
      });
    });

    describe('With optional props', () => {
      describe('\'labels\' is \'true\'', () => {
        it('initialises the labels (\'labels\' is \'true\')', () => {
          const chart = TestUtils.renderIntoDocument(
            <PieChart
              data={mockData}
              labels
            />
          );

          chart.initialise();

          expect(chart.initialiseLabels.called).to.be.true;
        });
      });
    });
  });

  describe('initialiseSlices()', () => {
    const chart = TestUtils.renderIntoDocument(
      <PieChart
        data={mockData}
      />
    );

    beforeEach(() => {
      sinon.spy(mockPath, 'enter');
      sinon.spy(mockPath, 'append');
      sinon.spy(mockPath, 'attr');
      sinon.spy(mockPath, 'on');
      sinon.spy(mockPath, 'each');

      sinon.stub(mockSlice, 'data').returns(mockPath);
      sinon.stub(chart, 'getSlices').returns(mockSlice);

      chart.initialiseSlices();
    });

    afterEach(() => {
      mockPath.enter.restore();
      mockPath.append.restore();
      mockPath.attr.restore();
      mockPath.on.restore();
      mockPath.each.restore();

      mockSlice.data.restore();
      chart.getSlices.restore();
    });

    it('initialises the slices', () => {
      expect(mockPath.enter.called).to.be.true;
      expect(mockPath.append.calledWith('path')).to.be.true;
      expect(mockPath.attr.calledWith('class', 'pie-chart-slice')).to.be.true;
      expect(mockPath.attr.calledWith('fill')).to.be.true;
      expect(mockPath.attr.calledWith('d')).to.be.true;
      expect(mockPath.on.calledWith('mouseover')).to.be.true;
      expect(mockPath.on.calledWith('mouseout')).to.be.true;
      expect(mockPath.on.calledWith('mousemove')).to.be.true;
      expect(mockPath.on.calledWith('click')).to.be.true;
      expect(mockPath.each.called).to.be.true;
    });
  });

  describe('initialiseLabels()', () => {
    const chart = TestUtils.renderIntoDocument(
      <PieChart
        data={mockData}
      />
    );

    beforeEach(() => {
      sinon.spy(mockText, 'enter');
      sinon.spy(mockText, 'append');
      sinon.spy(mockText, 'attr');
      sinon.spy(mockText, 'text');
      sinon.spy(mockText, 'each');

      sinon.stub(mockLabel, 'data').returns(mockText);
      sinon.stub(chart, 'getLabels').returns(mockLabel);

      chart.initialiseLabels();
    });

    afterEach(() => {
      mockText.enter.restore();
      mockText.append.restore();
      mockText.attr.restore();
      mockText.text.restore();
      mockText.each.restore();

      mockLabel.data.restore();
      chart.getLabels.restore();
    });

    it('initialises the labels', () => {
      expect(mockText.enter.called).to.be.true;
      expect(mockText.append.calledWith('text')).to.be.true;
      expect(mockText.attr.calledWith('dy', '.35em')).to.be.true;
      expect(mockText.attr.calledWith('class', 'pie-chart-label')).to.be.true;
      expect(mockText.attr.calledWith('transform')).to.be.true;
      expect(mockText.text.called).to.be.true;
      expect(mockText.each.called).to.be.true;
    });
  });

  describe('transition()', () => {
    beforeEach(() => {
      sinon.spy(PieChart.prototype, 'calculateChartParameters');
      sinon.spy(PieChart.prototype, 'transitionSlices');
      sinon.spy(PieChart.prototype, 'transitionLabels');
    });

    afterEach(() => {
      PieChart.prototype.calculateChartParameters.restore();
      PieChart.prototype.transitionSlices.restore();
      PieChart.prototype.transitionLabels.restore();
    });

    describe('Always', () => {
      const chart = TestUtils.renderIntoDocument(
        <PieChart
          data={mockData}
        />
      );

      beforeEach(() => {
        chart.transition();
      });

      it('transitions the slices', () => {
        expect(chart.transitionSlices.called).to.be.true;
      });

      it('does not transition the labels (\'labels\' is \'false\')', () => {
        expect(chart.transitionLabels.called).to.be.false;
      });
    });

    describe('With optional props', () => {
      describe('\'labels\' is \'true\'', () => {
        it('transitions the labels (\'labels\' is \'true\')', () => {
          const chart = TestUtils.renderIntoDocument(
            <PieChart
              data={mockData}
              labels
            />
          );

          chart.transition();

          expect(chart.transitionLabels.called).to.be.true;
        });
      });
    });
  });

  describe('transitionSlices()', () => {
    const chart = TestUtils.renderIntoDocument(
      <PieChart
        data={mockData}
      />
    );

    beforeEach(() => {
      sinon.spy(mockPath, 'enter');
      sinon.spy(mockPath, 'append');
      sinon.spy(mockPath, 'attr');
      sinon.spy(mockPath, 'on');
      sinon.spy(mockPath, 'each');
      sinon.spy(mockPath, 'transition');
      sinon.spy(mockPath, 'duration');
      sinon.spy(mockPath, 'attrTween');
      sinon.spy(mockPath, 'exit');
      sinon.spy(mockPath, 'remove');

      sinon.stub(mockSlice, 'data').returns(mockPath);
      sinon.stub(chart, 'getSlices').returns(mockSlice);

      chart.transitionSlices();
    });

    afterEach(() => {
      mockPath.enter.restore();
      mockPath.append.restore();
      mockPath.attr.restore();
      mockPath.on.restore();
      mockPath.each.restore();
      mockPath.transition.restore();
      mockPath.duration.restore();
      mockPath.attrTween.restore();
      mockPath.exit.restore();
      mockPath.remove.restore();

      mockSlice.data.restore();
      chart.getSlices.restore();
    });

    it('defines the transition', () => {
      expect(mockPath.transition.called).to.be.true;
      expect(mockPath.duration.calledWith(750)).to.be.true;
    });

    it('transitions the slices', () => {
      expect(mockPath.enter.called).to.be.true;
      expect(mockPath.append.calledWith('path')).to.be.true;
      expect(mockPath.attr.calledWith('class', 'pie-chart-slice')).to.be.true;
      expect(mockPath.attr.calledWith('fill')).to.be.true;
      expect(mockPath.on.calledWith('mouseover')).to.be.true;
      expect(mockPath.on.calledWith('mouseout')).to.be.true;
      expect(mockPath.on.calledWith('mousemove')).to.be.true;
      expect(mockPath.on.calledWith('click')).to.be.true;
      expect(mockPath.each.called).to.be.true;
      expect(mockPath.attrTween.calledWith('d')).to.be.true;
    });
  });

  describe('transitionLabels()', () => {
    const chart = TestUtils.renderIntoDocument(
      <PieChart
        data={mockData}
      />
    );

    beforeEach(() => {
      sinon.spy(mockText, 'enter');
      sinon.spy(mockText, 'append');
      sinon.spy(mockText, 'attr');
      sinon.spy(mockText, 'text');
      sinon.spy(mockText, 'each');
      sinon.spy(mockText, 'exit');
      sinon.spy(mockText, 'remove');
      sinon.spy(mockText, 'transition');
      sinon.spy(mockText, 'duration');

      sinon.stub(mockLabel, 'data').returns(mockText);
      sinon.stub(chart, 'getLabels').returns(mockLabel);

      chart.transitionLabels();
    });

    afterEach(() => {
      mockText.enter.restore();
      mockText.append.restore();
      mockText.attr.restore();
      mockText.text.restore();
      mockText.each.restore();
      mockText.exit.restore();
      mockText.remove.restore();
      mockText.transition.restore();
      mockText.duration.restore();

      mockLabel.data.restore();
      chart.getLabels.restore();
    });

    it('defines the transition', () => {
      expect(mockText.transition.called).to.be.true;
      expect(mockText.duration.calledWith(750)).to.be.true;
    });

    it('transitions the labels', () => {
      expect(mockText.enter.called).to.be.true;
      expect(mockText.append.calledWith('text')).to.be.true;
      expect(mockText.attr.calledWith('dy', '.35em')).to.be.true;
      expect(mockText.attr.calledWith('class', 'pie-chart-label')).to.be.true;
      expect(mockText.attr.calledWith('transform')).to.be.true;
      expect(mockText.text.called).to.be.true;
      expect(mockText.each.called).to.be.true;
      expect(mockText.exit.called).to.be.true;
      expect(mockText.remove.called).to.be.true;
    });
  });

  describe('Rendering the PieChart', () => {
    describe('Always', () => {
      const renderer = TestUtils.createRenderer();
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
  });
});
