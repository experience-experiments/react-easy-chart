import {
  select,
  axisBottom,
  axisLeft,
  axisRight,
  line
} from 'd3';

import {
  // createUniqueID,
  reduce,
  // defaultStyles,
  // getDefaultAxisStyles,
  defaultColors,
  createDomainX,
  createDomainY,
  createScaleX,
  createScaleY,
  createParserX,
  createParserY // ,
  // createFormatX,
  // createFormatY
} from './common';
import interpolateLine from '../../../interpolate';

function initialise(chart, props) {
  const {
    data,
    // axes,
    type,
    xType,
    yType,
    grid,
    hGrid,
    vGrid,
    width,
    height,
    margin,
    orient,
    xLabel,
    yLabel,
    colors,
    // strokeWidth,
    interpolate,
    pattern,
    // xPattern,
    // yPattern,
    xDomain,
    yDomain
  } = props;

  const {
    top: t,
    right: r,
    bottom: b,
    left: l
  } = margin;

  const m = {
    t,
    r,
    b,
    l
  };

  const w = [
    width,
    l,  // margin.left
    r   // margin.right
  ].reduce(reduce);

  const h = [
    height,
    t,  // margin.top
    b   // margin.bottom
  ].reduce(reduce);

  const strokes = colors.concat(defaultColors);

  const types = {
    x: xType || type,
    y: yType || type
  };

  const domains = {
    x: (Array.isArray(xDomain))
      ? xDomain
      : createDomainX(types.x, data, pattern),
    y: (Array.isArray(yDomain))
      ? yDomain
      : createDomainY(types.y, data, pattern)
  };

  const scales = {
    x: createScaleX(types.x, domains.x, w),
    y: createScaleY(types.y, domains.y, h)
  };

  const parsers = {
    x: createParserX(types.x, pattern),
    y: createParserY(types.y, pattern)
  };

  /*
  const patterns = {
    x: xPattern || pattern,
    y: yPattern || pattern
  };

  const formats = {
    x: createFormatX(types.x, patterns.x),
    y: createFormatY(types.y, patterns.y)
  };
  */

  const linePath = line()
    .curve(interpolateLine(interpolate))
    .x((d) => scales.x(parsers.x(d)))
    .y((d) => scales.y(parsers.y(d)));

  const root = select(chart)
    .append('g')
    .attr('class', 'chartGroup')
    .attr('transform', `translate(${l}, ${t})`);

  const xAxis = axisBottom(scales.x);

  if (vGrid || grid) {
    xAxis
      .tickSize(-h, 6)
      .tickPadding(10);
  } else {
    xAxis
      .tickSize(0, 6)
      .tickPadding(16);
  }

  const xGroup = root
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${h})`);

  xGroup
    .call(xAxis);

  if (xLabel) {
    xGroup
      .append('text')
      .attr('class', 'label')
      .attr('x', (orient === 'right')
          ? 0
          : w)
      .attr('y', (m.b - m.t))
      .attr('dx', (orient === 'right')
        ? '0em'
        : '-.175em')
      .attr('dy', '-.175em')
      .style('dominant-baseline', 'ideographic')
      .style('text-anchor', (orient === 'right')
        ? 'start'
        : 'end')
      .text(xLabel);
  }
  const yAxis = (orient === 'right') ? axisRight(scales.y) : axisLeft(scales.y);

  if (hGrid || grid) {
    yAxis
      .tickSize(-w, 6)
      .tickPadding(10);
  } else {
    yAxis
      .tickSize(0, 6)
      .tickPadding(16);
  }

  const yGroup = root
    .append('g')
    .attr('class', 'y axis')
    .attr('transform', (orient === 'right')
      ? `translate(${w}, 0)`
      : 'translate(0, 0)');

  yGroup
    .call(yAxis);

  if (yLabel) {
    yGroup
      .append('text')
      .attr('class', 'label')
      .attr('transform', 'rotate(-90)')
      .attr('x', 0)
      .attr('y', (orient === 'right')
        ? +m.r - m.l
        : -m.l + m.r)
      .attr('dx', 0)
      .attr('dy', (orient === 'right')
        ? '-.175em'
        : '1em')
      .style('dominant-baseline', 'ideographic')
      .style('text-anchor', 'end')
      .text(yLabel);
  }

  const getStroke = (d, i) => strokes[i];

  const chartPathsGroup = root
    .append('g')
    .attr('class', 'chartPathsGroup');

  chartPathsGroup
    .selectAll('path')
    .data(data)
    .enter()
    .append('path')
    .attr('class', 'line')
    .style('stroke', getStroke)
    .attr('d', linePath);
}

function transition(chart, props) {
  const {
    data,
    // axes,
    type,
    xType,
    yType,
    grid,
    hGrid,
    vGrid,
    width,
    height,
    margin,
    orient,
    xLabel,
    yLabel,
    colors,
    // strokeWidth,
    interpolate,
    pattern,
    // xPattern,
    // yPattern,
    xDomain,
    yDomain
  } = props;

  const {
    top: t,
    right: r,
    bottom: b,
    left: l
  } = margin;

  const m = {
    t,
    r,
    b,
    l
  };

  const w = [
    width,
    l,  // margin.left
    r   // margin.right
  ].reduce(reduce);

  const h = [
    height,
    t,  // margin.top
    b   // margin.bottom
  ].reduce(reduce);

  const strokes = colors.concat(defaultColors);

  const types = {
    x: xType || type,
    y: yType || type
  };

  const domains = {
    x: (Array.isArray(xDomain))
      ? xDomain
      : createDomainX(types.x, data, pattern),
    y: (Array.isArray(yDomain))
      ? yDomain
      : createDomainY(types.y, data, pattern)
  };

  const scales = {
    x: createScaleX(types.x, domains.x, w),
    y: createScaleY(types.y, domains.y, h)
  };

  const parsers = {
    x: createParserX(types.x, pattern),
    y: createParserY(types.y, pattern)
  };

  /*
  const patterns = {
    x: xPattern || pattern,
    y: yPattern || pattern
  };

  const formats = {
    x: createFormatX(types.x, patterns.x),
    y: createFormatY(types.y, patterns.y)
  };
  */

  const linePath = line()
    .curve(interpolateLine(interpolate))
    .x((d) => scales.x(parsers.x(d)))
    .y((d) => scales.y(parsers.y(d)));

  const n = data.length;

  const root = select(chart)
    .selectAll('g.chartGroup');

  root
    .transition()
    .duration(750)
    .attr('transform', `translate(${l}, ${t})`);

  const xAxis = axisBottom(scales.x);

  if (vGrid || grid) {
    xAxis
      .tickSize(-h, 6)
      .tickPadding(10);
  } else {
    xAxis
      .tickSize(0, 6)
      .tickPadding(16);
  }

  const xGroup = root
    .selectAll('g.x.axis');

  xGroup
    .call(xAxis);

  xGroup
    .transition()
    .duration(750)
    .attr('transform', `translate(0, ${h})`);

  xGroup
    .selectAll('text.label')
    .remove();

  if (xLabel) {
    xGroup
      .append('text')
      .attr('class', 'label')
      .attr('x', (orient === 'right')
          ? 0
          : w)
      .attr('y', (m.b - m.t))
      .attr('dx', (orient === 'right')
        ? '0em'
        : '-.175em')
      .attr('dy', '-.175em')
      .style('dominant-baseline', 'ideographic')
      .style('text-anchor', (orient === 'right')
        ? 'start'
        : 'end')
      .text(xLabel);
  }

  const yAxis = (orient === 'right') ? axisRight(scales.y) : axisLeft(scales.y);

  if (hGrid || grid) {
    yAxis
      .tickSize(-w, 6)
      .tickPadding(10);
  } else {
    yAxis
      .tickSize(0, 6)
      .tickPadding(16);
  }

  const yGroup = root
    .selectAll('g.y.axis');

  yGroup
    .call(yAxis);

  yGroup
    .transition()
    .duration(750)
    .attr('transform', (orient === 'right')
      ? `translate(${w}, 0)`
      : 'translate(0, 0)');

  yGroup
    .selectAll('text.label')
    .remove();

  if (yLabel) {
    yGroup
      .append('text')
      .attr('class', 'label')
      .attr('transform', 'rotate(-90)')
      .attr('x', 0)
      .attr('y', (orient === 'right')
        ? +m.r - m.l
        : -m.l + m.r)
      .attr('dx', 0)
      .attr('dy', (orient === 'right')
        ? '-.175em'
        : '1em')
      .style('dominant-baseline', 'ideographic')
      .style('text-anchor', 'end')
      .text(yLabel);
  }

  const getStroke = (d, i) => strokes[i];

  const chartPathsGroup = root
    .selectAll('g.chartPathsGroup path')
      .data(data);

  if (n) {
    chartPathsGroup
      .transition()
      .duration(750)
      .attr('class', 'line')
      .style('stroke', getStroke)
      .attr('d', (d) => linePath(d));

    chartPathsGroup
      .enter()
      .append('path')
      .attr('class', 'line')
      .style('stroke', getStroke)
      .attr('d', (d) => linePath(d));
  }

  chartPathsGroup
    .exit()
    .remove();
}

export default {
  initialise,
  transition
};
