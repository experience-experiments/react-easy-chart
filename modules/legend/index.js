import React from 'react';
import { Style } from 'radium';
import { scale } from 'd3';
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
      tags: React.PropTypes.array,
      dataId: React.PropTypes.string.isRequired,
      horizontal: React.PropTypes.bool,
      styles: React.PropTypes.object
    };
  }

  static get defaultProps() {
    return {
      tags: []
    };
  }

  componentWillMount() {
    const {
      dataId,
      data,
      tags
    } = this.props;

    data.forEach(
      (item) => {
        const index = tags.findIndex((tag) => tag === item[dataId]);
        if (index === -1) tags.push(item[dataId]);
      }
    );
  }

  getList() {
    const cn = this.props.horizontal ? 'horizontal' : '';
    return (
      this.props.tags.map(
        (item, index) => (
          <li key={index} className={cn}>
            <span
              className="icon"
              style={{ backgroundColor: this.getIconColor(index) }}
            />
            {item}
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
