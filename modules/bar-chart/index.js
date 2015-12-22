import React from 'react';
import scale from 'd3-scale';
import d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
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
    constructor(props) {
        super(props);
    }


    render() {
        let { data, margin, width, height, mouseOverHandler} = this.props;
        width = width - margin.left - margin.right;
        height = height - margin.top - margin.bottom;

        let self = this;
        let x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);
        let y = d3.scale.linear()
            .range([height, 0]);

        let xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        let yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10, "%");

        let svg = d3.select(ReactFauxDOM.createElement('svg'));

        svg.attr({
                width: width + margin.left + margin.right,
                height: height + margin.top + margin.bottom
            });

        let svgContainer = svg.append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        data.map((d,i) => {
            x.domain(data.map(function(d) { return d.key; }));
            y.domain([0, d3.max(data, function(d) { return d.value; })]);

            svgContainer.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svgContainer.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Frequency");

            svgContainer.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d.key); })
                .attr("width", x.rangeBand())
                .attr("y", function(d) { return y(d.value); })
                .attr("height", function(d) { return height - y(d.value); })
                .on('mouseover', function(d){
                    console.log('mouseover happened ' + d);
                    mouseOverHandler(d);
                });
        });


        return <div className='bar-chart'>
            <Style
                scopeSelector=".bar-chart"
                rules={styles}/>
            {svg.node().toReact()}
        </div>;
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
    data: [
        {
            "key": "A",
            "value": .08167
        },
        {
            "key": "B",
            "value": .09167
        },{
            "key": "C",
            "value": .09167
        },{
            "key": "D",
            "value": .09167
        },{
            "key": "E",
            "value": .09167
        },{
            "key": "F",
            "value": .09167
        },{
            "key": "G",
            "value": .09167
        },{
            "key": "H",
            "value": .09167
        },{
            "key": "I",
            "value": .09167
        },{
            "key": "K",
            "value": .09167
        },{
            "key": "L",
            "value": .09167
        },{
            "key": "M",
            "value": .09167
        },{
            "key": "N",
            "value": .09167
        },{
            "key": "O",
            "value": .09167
        },{
            "key": "P",
            "value": .09167
        },{
            "key": "Q",
            "value": .09167
        },{
            "key": "R",
            "value": .09167
        },{
            "key": "S",
            "value": .09167
        },{
            "key": "T",
            "value": .09167
        },{
            "key": "U",
            "value": .09167
        },{
            "key": "V",
            "value": .09167
        }
    ],
    width: 960,
    height: 500,
    barHeight: 20
};
