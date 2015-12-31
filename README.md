# rc-d3


##Introduction
This set of components aims to be the easiest and fastest way of implementing a graph within a React application.
Under the hood we use D3 to create and render the charts but the aim is to avoid users having to learn D3 if you want to create a standard chart.
We have concentrated on making an API that is consistent across the different graphs that at it's most basic would just require a single JSON representation of the data.
The graphs though also support more advanced use cases such as mouseover, mousemove, mouseout, on-click events.  

##Background and Motivation
There are quite a few d3/React libraries about including probably the most sophisticated being:
- https://github.com/esbullington/react-d3/

There are also a few different techniques for implementing D3

There are some subtle differences in how rc-d3 is implemented that react-d3.
Rather than re-develop the existing excellent (D3)[https://github.com/mbostock/d3/wiki/Gallery] charts into seperate  



https://github.com/esbullington/react-d3

It is aimed at


[![Build Status](https://travis-ci.org/rma-consulting/rc-d3.svg)](https://travis-ci.org/rma-consulting/rc-d3)

React component implementations of Mike Bostok's D3 visualisation library.

Inspired by http://oli.me.uk/2015/09/09/d3-within-react-the-right-way/

Using:
https://github.com/Olical/react-faux-dom
