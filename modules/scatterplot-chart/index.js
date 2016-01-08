import React from 'react';

export default class ScatterplotChart extends React.Component {

  render() {
    const uid = Math.floor(Math.random() * new Date().getTime());
    return (
      <div className={`scatterplot_chart${uid}`}>
        <h1>Scatterplot Chart</h1>
      </div>
    );
  }
}

ScatterplotChart.propTypes = {

};

ScatterplotChart.defaultProps = {
  mouseOverHandler: () => {},
  mouseOutHandler: () => {},
  mouseMoveHandler: () => {},
  clickHandler: () => {}
};
