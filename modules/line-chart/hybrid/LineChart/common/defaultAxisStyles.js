export const defaultAxisStyles = (vGrid, hGrid, orient) => ({
  '.x circle.tick-circle': {
    fill:
      (vGrid)
        ? 'none'
        : 'lightgrey'
  },
  '.y circle.tick-circle': {
    cx:
      (orient === 'right')
        ? '+6px'
        : '-6px',
    fill:
      (hGrid)
        ? 'none'
        : 'lightgrey'
  },
  '.y.axis line': {
    display:
      (hGrid)
        ? 'inline'
        : 'none',
    stroke: 'lightgrey'
  }
});
