import {extent} from 'd3-array';

export function reduce(x) {
  let rVal = x;
  for (let i = 1; i < arguments.length; i++) {
    rVal -= arguments[i];
  }
  return rVal;
}

export function getValueFunction(scale, type, dateParser) {
  const dataIndex = scale === 'x' ? 'x' : 'y';
  switch (type) {
    case 'time':
      return (d) => dateParser(d[dataIndex]);
    default:
      return (d) => d[dataIndex];
  }
}

export function getRandomId() {
  return Math.floor(Math.random() * new Date().getTime());
}

export function calcMargin(axes, margin) {
  if (margin) return margin;
  return axes ? {top: 20, right: 20, bottom: 50, left: 50} : {top: 0, right: 0, bottom: 0, left: 0};
}

export function findLargestExtent(data, valueFunction) {
  let low;
  let high;
  data.map((dataElement) => {
    const calcDomainRange = extent(dataElement, valueFunction);
    low = low < calcDomainRange[0] ? low : calcDomainRange[0];
    high = high > calcDomainRange[1] ? high : calcDomainRange[1];
  });
  return [low, high];
}

export function calcDefaultDomain(domainRange, type, dateParser) {
  if (!domainRange) return null;
  switch (type) {
    case 'time':
      return [dateParser(domainRange[0]), dateParser(domainRange[1])];
    default:
      return domainRange;
  }
}
