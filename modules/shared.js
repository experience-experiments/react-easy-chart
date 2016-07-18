import { extent } from 'd3-array';
import { scaleLinear as linear, scalePoint as point } from 'd3-scale';
import { time, select } from 'd3';

export const defaultColors = [
  '#3F4C55',
  '#E3A51A',
  '#F4E956',
  '#AAAC84'
];

export const defaultStyles = {
  '.pie-chart-slice': {
    stroke: '#fff',
    strokeWidth: 1,
    opacity: '1'
  },
  '.pie-chart-slice:hover': {
    opacity: '0.8'
  },
  '.pie-chart-label': {
    fontFamily: 'sans-serif',
    fontSize: '12px',
    textAnchor: 'middle',
    fill: '#000'
  },
  '.bar': {
    fill: 'blue',
    transition: 'height 0.5s ease-in, width 0.5s ease-in, x 0.5s ease-in, y 0.5s ease-in',
    opacity: 1
  },
  '.bar:hover': {
    opacity: 0.8
  },
  '.line': {
    fill: 'none',
    strokeWidth: 1.5,
    opacity: 0.7
  },
  '.line:hover': {
    opacity: 1
  },
  '.area': {
    opacity: 0.7
  },
  '.area:hover': {
    opacity: 1
  },
  '.dot': {
    strokeWidth: 0,
    opacity: 0.85,
    transition: 'r 0.5s ease-in, cx 0.5s ease-in, cy 0.5s ease-in'
  },
  '.dot:hover': {
    opacity: 1
  },
  'circle.data-point': {
    r: 4,
    opacity: 0.7,
    transition: 'cx 0.5s ease-in, cy 0.5s ease-in'
  },
  'circle.data-point:hover': {
    r: 6,
    opacity: 1
  },
  'circle.tick-circle': {
    r: 2,
    fill: 'lightgrey'
  },
  '.x circle.tick-circle': {
    cy: '8px'
  },
  '.axis': {
    'font-family': 'dobra-light,Arial,sans-serif',
    'font-size': '9px'
  },
  '.axis .label': {
    font: '14px arial'
  },
  '.axis path, .axis line': {
    fill: 'none',
    strokeWidth: 1,
    'shape-rendering': 'crispEdges'
  },
  'x.axis path': {
    display: 'none',
    stroke: 'lightgrey'
  },
  '.tick line': {
    stroke: 'lightgrey',
    strokeWidth: 1,
    opacity: '0.7'
  }
};

export function reduce(...args) {
  let rVal = args[0];
  for (let i = 1; i < args.length; i++) {
    rVal -= args[i];
  }
  return rVal;
}

export function getValueFunction(scale, type, dateParser) {
  const dataIndex =
    (scale === 'x')
      ? 'x'
      : 'y';
  return (type === time)
    ? (d) => dateParser(d[dataIndex])
    : (d) => d[dataIndex];
}

export function createCircularTicks(containerElement) {
  select(containerElement)
    .select('svg')
    .selectAll('.tick-circle')
    .remove();

  const ticks = select(containerElement)
    .select('svg')
    .selectAll('.tick');

  function circleAppender() {
    select(this)
    .append('circle')
    .attr('class', 'tick-circle');
  }
  ticks.each(circleAppender);
}

export function getAxisStyles(grid, verticalGrid, yAxisOrientRight) {
  return {
    '.x circle.tick-circle ': {
      fill: verticalGrid ? 'none' : 'lightgrey'
    },
    '.y circle.tick-circle': {
      cx: yAxisOrientRight ? '+5px' : '-8px',
      fill: grid ? 'none' : 'lightgrey'
    },
    '.y.axis line': {
      display: grid ? 'inline' : 'none',
      stroke: 'lightgrey'
    }
  };
}

export function getRandomId() {
  return Math.floor(Math.random() * new Date().getTime());
}

export function calcMargin(axes, margin, yAxisOrientRight, y2) {
  if (margin) return margin;
  if (yAxisOrientRight) {
    return (axes)
      ? { top: 20, right: 50, bottom: 50, left: (y2) ? 50 : 20 }
      : { top: 0, right: 0, bottom: 0, left: 0 };
  } else {
    return (axes)
      ? { top: 20, right: (y2) ? 50 : 20, bottom: 50, left: 50 }
      : { top: 0, right: 0, bottom: 0, left: 0 };
  }
}

export function findLargestExtent(data, valueFunction) {
  let lo; // Low
  let hi; // High
  data.forEach((dataElement) => {
    const domainRange = extent(dataElement, valueFunction);
    const LO = domainRange[0];
    const HI = domainRange[1];
    lo = lo < LO ? lo : LO;
    hi = hi > HI ? hi : HI;
  });
  return [lo, hi];
}

export function calcDefaultDomain(domainRange, type, dateParser) {
  if (domainRange) {
    return (type === 'time')
      ? (() => {
        const lo = dateParser(domainRange[0]);
        const hi = dateParser(domainRange[1]);
        return [lo, hi]
      })()
      : domainRange;
  }
  return null;
}

export function setLineDomainAndRange(scale, domainRange, data, type, length, parseDate) {
  const dataIndex = scale === 'x' ? 'x' : 'y';
  let axis;
  switch (type) {
    case 'text':
      axis = point();
      axis
        .domain(
          (domainRange)
            ? calcDefaultDomain(domainRange, type, parseDate)
            : data[0].map((d) => d[dataIndex]))
          .range([0, length])
          .padding(0);
      break;
    case 'linear':
      axis = linear();
      axis
        .domain(
          (domainRange)
            ? calcDefaultDomain(domainRange, type, parseDate)
            : findLargestExtent(data, getValueFunction(scale, type, parseDate)))
        .range(
          (scale === 'x')
            ? [0, length]
            : [length, 0]);
      break;
    case 'time':
      axis = time.scale();
      axis
        .domain(
          (domainRange)
            ? calcDefaultDomain(domainRange, type, parseDate)
            : findLargestExtent(data, getValueFunction(scale, type, parseDate)))
        .range(
          (scale === 'x')
            ? [0, length]
            : [length, 0]);
      break;
    default:
      break;
  }
  return axis;
}
