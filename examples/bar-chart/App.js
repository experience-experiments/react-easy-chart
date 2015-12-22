import React from 'react';
import ReactDOM from 'react-dom';

import BarChart from 'rc-d3/bar-chart';


let mouseOverHandler = function (e) {
    console.log(e);
}



class BarChartContainer extends React.Component {
    constructor(props) {
        super(props);
        this.data = props.data;
    }



    updateData (e) {
        this.data = [
            {
                "key": "A",
                "value": .09167
            },
            {
                "key": "B",
                "value": .02167
            },{
                "key": "C",
                "value": .02167
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
                "value": .02167
            },{
                "key": "V",
                "value": .02167
            }
        ];
        this.forceUpdate();
    }

    render() {
        return <div>
            <input type='button' value='reset the data' onClick={this.updateData.bind(this)}></input>
            <BarChart
            mouseOverHandler={mouseOverHandler}
            data={this.data}/>
        </div>
    }
}

BarChartContainer.defaultProps = {
    data: [
        {
            "key": "A",
            "value": .03167
        },
        {
            "key": "B",
            "value": .02167
        },{
            "key": "C",
            "value": .02167
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
    ]
};

ReactDOM.render(
    <BarChartContainer/>
   , document.getElementById('root'));



