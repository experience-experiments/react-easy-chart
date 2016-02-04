/* eslint-env node, mocha */
import chai, {should as chaiShould, expect} from 'chai';
import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import {Legend} from 'react-easy-chart';
import spies from 'chai-spies';

const should = chaiShould();
chai.use(spies);

const pieData = [
  {key: 'Cats', value: 100},
  {key: 'Dogs', value: 200},
  {key: 'Other', value: 50}
];

describe('Legend component', () => {
  it('Should be defined', () => {
    should.exist(Legend);
    Legend.should.be.a('function');
  });

  it('Should render without problems', () => {
    const legend = TestUtils.renderIntoDocument(<Legend data={pieData} dataId={'key'} />);
    should.exist(legend);
  });

  it(`Should render an unordered list with correct number of list items and
  show the correct label for each item`, () => {
    const shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<Legend data={pieData} dataId={'key'} />);
    const vDom = shallowRenderer.getRenderOutput();
    expect(vDom.type).to.equal('div');
    const ul = vDom.props.children[1];
    expect(ul.type).to.equal('ul');
    expect(ul.props.children.length).to.equal(pieData.length);
    pieData.map(
      (item, index) => {
        const li = ul.props.children[index];
        const label = li.props.children[1];
        expect(label).to.equal(pieData[index].key);
      }
    );
  });
});
