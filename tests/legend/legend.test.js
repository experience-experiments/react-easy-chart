/* eslint-env node, mocha */
import {should as chaiShould, expect} from 'chai';
import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import {Legend} from 'react-easy-chart';
import {scale} from 'd3';

const should = chaiShould();

const pieData = [
  {key: 'Cats', value: 100},
  {key: 'Dogs', value: 200},
  {key: 'Other', value: 50}
];

const pieDataCustom = [
  {key: 'Cats', value: 100, color: 'teal'},
  {key: 'Dogs', value: 200, color: 'thistle'},
  {key: 'Other', value: 50, color: 'tomato'}
];

const config = [
  {color: 'teal'},
  {color: 'thistle'},
  {color: 'tomato'}
];

const colors = scale.category20().range();

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
  show the correct label and color for each item`, () => {
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
        const iconColor = li.props.children[0].props.style.backgroundColor;
        const label = li.props.children[1];
        // test icon color
        expect(iconColor).to.equal(colors[index]);
        // test label text
        expect(label).to.equal(pieData[index].key);
      }
    );
  });

  it('Should set li class prop to horizontal if horizontal is true', () => {
    const shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<Legend data={pieData} dataId={'key'} horizontal />);
    const vDom = shallowRenderer.getRenderOutput();
    const li = vDom.props.children[1].props.children[0];
    expect(li.props.className).to.equal('horizontal');
  });

  it('Should render custom icon colors if a config is provided', () => {
    const shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<Legend data={pieDataCustom} dataId={'key'} config={config} />);
    const vDom = shallowRenderer.getRenderOutput();
    const ul = vDom.props.children[1];
    config.map(
      (item, index) => {
        const li = ul.props.children[index];
        const iconColor = li.props.children[0].props.style.backgroundColor;
        expect(iconColor).to.equal(config[index].color);
      }
    );
  });
});
