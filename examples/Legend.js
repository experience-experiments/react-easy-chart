import React from 'react';
import PropTypes from 'prop-types';
import { Style } from 'radium';
import {
  scaleOrdinal,
  schemeCategory10,
  range,
} from 'd3';

const legendStyles = {
  '.legend': {
    border: 'solid silver 1px',
    backgroundColor: 'white',
    borderRadius: '6px',
    padding: '12px'
  },
  '.legend li': {
    display: 'inline-block',
    lineHeight: '24px',
    marginRight: '24px',
    marginBottom: '6px',
    paddingLeft: '18px',
    position: 'relative'
  },
  '.legend .icon': {
    width: '12px',
    height: '12px',
    background: 'red',
    borderRadius: '6px',
    position: 'absolute',
    left: '0',
    top: '50%',
    marginTop: '-6px'
  }
};

const colors = scaleOrdinal(schemeCategory10).domain(range(0, 20)).range();

class Legend extends React.Component {

  static get propTypes() {
    return {
      config: PropTypes.array,
      data: PropTypes.array
    };
  }

  static get defaultProps() {
    return {
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    };
  }

  getList() {
    return (
      this.props.data.map(
        (item, index) => (
          <li key={index}>
            <span
              className="icon"
              style={{ backgroundColor: this.getIconColor(index) }}
            />
            {item.type}
          </li>
        )
      )
    );
  }

  getIconColor(index) {
    const {
      config
    } = this.props;

    if (typeof config !== 'undefined') {
      if (config.length > index) {
        return config[index].color;
      }
    }
    return colors[index];
  }

  render() {
    return (
      <div className="legend-container">
        <Style scopeSelector=".legend-container" rules={legendStyles} />
        <ul className="legend">{this.getList()}</ul>
      </div>
    );
  }
}

export default Legend;
