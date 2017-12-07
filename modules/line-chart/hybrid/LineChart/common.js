
import { scaleTime, timeFormat } from 'd3';
import { extent } from 'd3-array';
import { scaleLinear, scalePoint } from 'd3-scale';
import { timeParse } from 'd3-time-format';

import defaultStyles from './common/defaultStyles';
import { defaultAxisStyles } from './common/defaultAxisStyles';
import defaultColors from './common/defaultColors';

const TIMEPARSER = {};
const TIMEFORMAT = {};

const mapDatumTimeX = (p) => (d) => p(d.x);
const mapDatumTimeY = (p) => (d) => p(d.y);
const mapDatumX = (d) => d.x;
const mapDatumY = (d) => d.y;

export {
  mapDatumTimeX,
  mapDatumTimeY,
  mapDatumX,
  mapDatumY
};

const formatDatumTimeX = (p) => (d) => p(d.x);
const formatDatumTimeY = (p) => (d) => p(d.y);
const formatDatumX = (d) => d.x;
const formatDatumY = (d) => d.y;

export {
  formatDatumTimeX,
  formatDatumTimeY,
  formatDatumX,
  formatDatumY
};

const formatString = (v) => (v);
const formatNumber = (n) => (
  (n % 1)
    ? n.toFixed(1)
    : n);

export function formatType(type) {
  return (type === 'text')
      ? formatString
      : formatNumber;
}

function createParser(pattern = '%d-%b-%y') {
  return (
    TIMEPARSER[pattern] || (
    TIMEPARSER[pattern] = timeParse(pattern)));
}

export function createMapDatumX(type, pattern) {
  return (type === 'time')
    ? formatDatumTimeX(createParser(pattern))
    : formatDatumX;
}

export function createMapDatumY(type, pattern) {
  return (type === 'time')
    ? formatDatumTimeY(createParser(pattern))
    : formatDatumY;
}

export function createParserDatumX(type, pattern) {
  return (type === 'time')
    ? formatDatumTimeX(createParser(pattern))
    : formatDatumX;
}

export function createParserDatumY(type, pattern) {
  return (type === 'time')
    ? formatDatumTimeY(createParser(pattern))
    : formatDatumY;
}

export function createParserY(type, pattern) {
  return (type === 'time')
    ? formatDatumTimeY(createParser(pattern))
    : formatDatumY;
}

export function createParserX(type, pattern) {
  return (type === 'time')
    ? formatDatumTimeX(createParser(pattern))
    : formatDatumX;
}

export { createParser };

function createFormat(pattern = '%b %d') {
  return (
    TIMEFORMAT[pattern] || (
    TIMEFORMAT[pattern] = timeFormat(pattern)));
}

export function createFormatX(type, pattern) {
  return (type === 'time')
    ? createFormat(pattern)
    : (v) => v;
}

export function createFormatY(type, pattern) {
  return (type === 'time')
    ? createFormat(pattern)
    : (v) => v;
}

export { createFormat };

export function calculateDomain(data, map) {
  const domain = [];

  data.forEach((item) => {
    item.forEach((d, i) => {
      const v = map(d);
      if (!domain.includes(v)) {
        domain.splice(i, 0, v);
      }
    });
  });

  return domain;
}

export function calculateExtent(data, map) {
  let min; // Low
  let max; // High
  data.forEach((row) => {
    const [MIN, MAX] = extent(row, map);
    /*
     * Equivalent to
     *
     * Math.min()
     * Math.max()
     *
     * For non-numeric values
     */
    min =
      (min < MIN)
        ? min
        : MIN;
    max =
      (max > MAX)
        ? max
        : MAX;
  });
  return [min, max];
}

export function createDomainX(type, data, pattern) {
  switch (type) {
    case 'time':
      return calculateExtent(data, mapDatumTimeX(createParser(pattern)));
    case 'text':
      return calculateDomain(data, mapDatumX);
    default:
      return calculateExtent(data, mapDatumX);
  }
}

export function createDomainY(type, data, pattern) {
  switch (type) {
    case 'time':
      return calculateExtent(data, mapDatumTimeY(createParser(pattern)));
    case 'text':
      return calculateDomain(data, mapDatumY);
    default:
      return calculateExtent(data, mapDatumY);
  }
}

/* eslint no-param-reassign: 0 */
export const reduce = (p, c) => (p -= c);

export const createUniqueID = () => Math.floor(Math.random() * new Date().getTime());

export function createScaleTimeX(domain = [], x = 0) {
  return scaleTime()
    .domain(domain)
    .range([0, x]);
}

export function createScaleTimeY(domain = [], y = 0) {
  return scaleTime()
    .domain(domain)
    .range([y, 0]);
}

export function createScaleTextX(domain = [], s = 0) {
  return scalePoint()
    .domain(domain)
    .range([0, s])
    .padding(0);
}

export function createScaleTextY(domain = [], s = 0) {
  return scalePoint()
    .domain(domain)
    .range([0, s])
    .padding(0);
}

export function createScaleLinearX(domain = [], x = 0) {
  return scaleLinear()
    .domain(domain)
    .range([0, x]);
}

export function createScaleLinearY(domain = [], y = 0) {
  return scaleLinear()
    .domain(domain)
    .range([y, 0]);
}

export function createScaleY(type, domain = [], y = 0) {
  switch (type) {
    case 'time':
      return createScaleTimeY(domain, y);
    case 'text':
      return createScaleTextY(domain, y);
    default:
      return createScaleLinearY(domain, y);
  }
}

export function createScaleX(type, domain = [], x = 0) {
  switch (type) {
    case 'time':
      return createScaleTimeX(domain, x);
    case 'text':
      return createScaleTextX(domain, x);
    default:
      return createScaleLinearX(domain, x);
  }
}

export {
  defaultStyles,
  defaultColors
};

export { defaultAxisStyles as getDefaultAxisStyles };
