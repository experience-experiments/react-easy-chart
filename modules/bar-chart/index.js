import React from 'react';
import { ordinal, linear } from 'd3-scale';
import { select, svg, max} from 'd3';
import { createElement } from 'react-faux-dom';
import { Style } from 'radium';

const styles = {
  'svg': {
    border: 'solid silver 1px'
  },
  '.bar': {
    fill: 'blue'
  },
  '.bar:hover': {
    fill: 'brown'
  },
  '.axis': {
    font: '10px sans-serif'
  },
  '.axis path,.axis line': {
    fill: 'none',
    stroke: '#000',
    'shape-rendering': 'crispEdges'
  },
  'x.axis path': {
    display: 'none'
  }
};


export default class BarChart extends React.Component {
    render() {
      const { data, margin, mouseOverHandler} = this.props;
      let {width, height} = this.props;
      width = width - margin.left - margin.right;
      height = height - margin.top - margin.bottom;

      const x = ordinal()
          .rangeRoundBands([0, width], 0.1);
      const y = linear()
          .range([height, 0]);

      const xAxis = svg.axis()
          .scale(x)
          .orient('bottom');

      const yAxis = svg.axis()
          .scale(y)
          .orient('left')
          .ticks(10, '%');

      const node = createElement('svg');
      const selection = select(node);

      selection.attr({
        width: width + margin.left + margin.right,
        height: height + margin.top + margin.bottom
      });

      const svgContainer = selection.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

      x.domain(data.map((d) => d.key));
      y.domain([0, max(data, (d) => d.value)]);

      data.map(() => {
        svgContainer.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        svgContainer.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('Frequency');

        svgContainer.selectAll('.bar')
            .data(data)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', (d) => x(d.key))
            .attr('width', x.rangeBand())
            .attr('y', (d) => y(d.value))
            .attr('height', (d) => height - y(d.value))
            .on('mouseover', (d) => mouseOverHandler(d));
      });

      return (
        <div className="bar-chart">
          <Style scopeSelector=".bar-chart" rules={styles}/>
          {node.toReact()}
        </div>
      );
    }
}

BarChart.propTypes = {
  data: React.PropTypes.array.isRequired,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  margin: React.PropTypes.object,
  mouseOverHandler: React.PropTypes.func
};

BarChart.defaultProps = {
  margin: {top: 20, right: 20, bottom: 30, left: 40},
  width: 960,
  height: 500
};
