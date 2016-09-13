# React Easy Chart

![animated graph](examples/images/animated-graph.gif)

## Introduction

This set of graphing components aims to be the easiest and fastest way of implementing a graph within a React application.

The graphs all have the following features:
- Easy to set up with only a requirement for data to render a chart
- Support realtime data feeds by reacting to data changes passed into the props automatically
- Fast rendering by using React to minimise the changes to the DOM as a result of data or props changes
- Configurable via props to allow features such as grids, width, height, axis and many more features to be added
- Responsive and Reactive graphs to fit to any device
- Interactive via mouse and click events allowing interesting applications to be built without graphing knowledge

Under the hood we use the fantastic [D3](http://d3js.org/) to create and render the charts into SVG. D3 requires some learning and will ultimately provide more flexible charts. The aim of React Easy Chart is to avoid that learning and have a common set of charts that can be set up in minutes.

We have concentrated on making an API that is consistent across a different set of graphs so allowing different graphs to be chosen for the same data set. Currently we provide a bar, line, area, scatter and pie chart.

## Installation
`npm install react-easy-chart --save`

The chart component you wish to use can then be simply imported.  
Area chart:

`import {AreaChart} from 'react-easy-chart';`

Bar chart:

`import {BarChart} from 'react-easy-chart';`

Line chart:

`import {LineChart} from 'react-easy-chart';`

Pie chart:

`import {PieChart} from 'react-easy-chart';`

Scatter chart:

`import {ScatterChart} from 'react-easy-chart';`

Chart Legend:

`import {Legend} from 'react-easy-chart';`


## Documentation
Each of the charts have had extensive documentation produced for them with working examples. These can be found at  [http://rma-consulting.github.io/react-easy-chart](http://rma-consulting.github.io/react-easy-chart)

## Contributing
We welcome pull requests and forks of the current graph implementations. If you are able to follow the API we have set out and are developing a chart we currently do not have we would love to add to our existing library.

## Background and Motivation
The project started by trying to optimize D3 charts for React. After some reading and trial and error we came across this blog post [http://oli.me.uk/2015/09/09/d3-within-react-the-right-way/](http://oli.me.uk/2015/09/09/d3-within-react-the-right-way/)
Oliver provided us with a solution that can utilize the react shadow DOM by creating a faux DOM to attach the SVG elements to. This is in our opinion the best current solution.

The complexity of developing D3 based graphs intermittently often means that even experienced JavaScript developers can take days getting back up to speed for making the most simple of Graphs. The React Easy Chart Library is flexible and robust enough to avoid needing to remember D3 syntax when simple graphs are required.   


### Version
[![npm version](https://badge.fury.io/js/react-easy-chart.png)](https://www.npmjs.com/package/react-easy-chart)

### Build Status
[![Build Status](https://travis-ci.org/rma-consulting/react-easy-chart.svg)](https://travis-ci.org/rma-consulting/react-easy-chart)
