import React from 'react';
import ReactDOM from 'react-dom';

import BarChart from 'rc-d3/bar-chart';


let mouseOverHandler = function (e) {
    console.log(e);
}



class BarChartContainer extends React.Component {
    constructor(props) {
        super(props);
        this.data = this.generateData();
    }

    generateData() {
        let data = [],
            keys = ['A','B','C','D','E','F','G','H','I','J','K','L','M'];

        keys.map((key, i) => {
            data.push({key: key, value: this.getRandomArbitrary(0.1, 0)});
        })
        return data;
    }



    turnOnSetTimeout() {
        setInterval( this.updateData.bind(this), 100);
    }


    generateDataSingle() {
        this.data[0].value = this.getRandomArbitrary(0.08, 0);
        return this.data;
    }

    getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    updateData (e) {
        this.data = this.generateData();
        this.forceUpdate();
    }

    render() {
        return <div>
            <input type='button' value='reset the data' onClick={this.updateData.bind(this)}></input>
            <input type='button' value='Turn On setTimeOut' onClick={this.turnOnSetTimeout.bind(this)}></input>
            <BarChart
            mouseOverHandler={mouseOverHandler}
            data={this.data}/>
            <BarChart
                mouseOverHandler={mouseOverHandler}
                width={100}
                height={60}
                data={this.data}/>
        </div>
    }
}


ReactDOM.render(
    <BarChartContainer/>
   , document.getElementById('root'));



