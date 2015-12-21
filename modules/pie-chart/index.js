import React from 'react';
export default class PieChart extends React.Component {

  getData() {
    return (
      this.props.data.map(
        (item, index) => {
          return (
            <div key={index}>
              <h3>{item.age}</h3>
              <p>{item.population}</p>
            </div>
          )
        }
      )
    )
  }

  render() {
    return (
      <div>
        <h1>Pie Chart</h1>
        {this.getData()}
        <svg />
      </div>
    )
  }
}

PieChart.propTypes = {
  data: React.PropTypes.array.isRequired
};
