import React from 'react';
import { Style } from 'radium';
import {scale} from 'd3';
import merge from 'lodash.merge';

const defaultStyles = {
  '.legend': {
    'list-style': 'none',
    margin: 0,
    padding: 0
  },
  '.legend li': {
    display: 'block',
    lineHeight: '24px',
    marginRight: '24px',
    marginBottom: '6px',
    paddingLeft: '24px',
    position: 'relative'
  },
  '.legend li.horizontal': {
    display: 'inline-block'
  },
  '.legend .icon': {
    width: '12px',
    height: '12px',
    borderRadius: '6px',
    position: 'absolute',
    left: '0',
    top: '50%',
    marginTop: '-6px'
  }
};

const colors = scale.category20().range();

export default class Legend extends React.Component {

  static get propTypes() {
    return {
      config: React.PropTypes.array,
      data: React.PropTypes.array.isRequired,
      dataId: React.PropTypes.string.isRequired,
      horizontal: React.PropTypes.bool,
      styles: React.PropTypes.object
    };
  }

  constructor(props) {
    super(props);
  }

  getList() {
    const cn = this.props.horizontal ? 'horizontal' : '';
    return (
      this.props.data.map(
        (item, index) => {
          return (
            <li key={index} className={cn}>
              <span
                className="icon"
                style={{backgroundColor: this.getIconColor(index)}}
              >
            </span>
            {item[this.props.dataId]}
            </li>
          );
        }
      )
    );
  }

  getIconColor(index) {
    if (typeof this.props.config !== 'undefined') {
      if (this.props.config.length > index) {
        return this.props.config[index].color;
      }
    }
    return colors[index];
  }

  render() {
    const uid = Math.floor(Math.random() * new Date().getTime());
    return (
      <div className={`legend-container-${uid}`}>
        <Style
          scopeSelector={`.legend-container-${uid}`}
          rules={merge({}, defaultStyles, this.props.styles)}
        />
        <ul className="legend">{this.getList()}</ul>
      </div>
    );
  }
}
