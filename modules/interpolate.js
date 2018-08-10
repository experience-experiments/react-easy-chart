import {
  curveLinear,
  curveStepBefore,
  curveStepAfter,
  curveBasis,
  curveBasisOpen,
  curveBasisClosed,
  curveBundle,
  curveCardinal,
  curveCardinalOpen,
  curveCardinalClosed,
  curveNatural,
  curveMonotoneX,
  curveMonotoneY
} from 'd3';

const interpolate = (type) => {
  switch (type) {
    case 'stepBefore':
      return curveStepBefore;
    case 'stepAfter':
      return curveStepAfter;
    case 'basis':
      return curveBasis;
    case 'basisOpen':
      return curveBasisOpen;
    case 'basisClosed':
      return curveBasisClosed;
    case 'bundle':
      return curveBundle;
    case 'cardinal':
      return curveCardinal;
    case 'cardinalOpen':
      return curveCardinalOpen;
    case 'cardinalClosed':
      return curveCardinalClosed;
    case 'natural':
      return curveNatural;
    case 'monotoneX':
      return curveMonotoneX;
    case 'monotoneY':
      return curveMonotoneY;
    default:
      return curveLinear;
  }
};

export default interpolate;
