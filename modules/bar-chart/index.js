import React from 'react';
import scale from 'd3-scale';

export default class BarChart extends React.Component {

    render() {
        const data = this.props.data;

        const width = this.props.width,
            barHeight = this.props.barHeight;

        const x = scale.linear()
            .domain([100, 300])
            .range([0, width]);

        return (
            <svg className="chart" width={width} height={barHeight * data.length}>
                {data.map((n, i) => {
                        return <g key={i} transform={ `translate(0, ${barHeight * i})`}>
                            <rect width={x(n.numbers)} height={barHeight - 1} fill="purple" />
                        </g>;
                    }
                )}
            </svg>
        );
    }
}

BarChart.propTypes = {
    data: React.PropTypes.array.isRequired,
    width: React.PropTypes.number,
    colHeight: React.PropTypes.number
};

BarChart.defaultProps = {
    data: [{
            "year": "1990",
            "numbers": 200
        }, {
            "year": "1995",
            "numbers": 190
        }, {
            "year": "2000",
            "numbers": 130
        },{
        "year": "2010",
        "numbers": 1130
        }],
    colHeight: 20,
    width: 500,
    barHeight: 20
};
