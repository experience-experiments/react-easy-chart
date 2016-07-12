import React from 'react';
import { Style } from 'radium';
import { scale } from 'd3';
import merge from 'lodash.merge';

import defaultStyles from './defaultStyles';

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

  constructor(props) {
    super(props);

    this.uid = Math.floor(Math.random() * new Date().getTime());
  }

  getBackgroundColor(index) {
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

  createListItems() {
    const {
      horizontal
    } = this.props;

    const cn = horizontal ? 'horizontal' : '';

    return (
      this.props.tags.map(
        (item, index) => (
          <li key={`legend-list-item-${index}`} className={cn}>
            <span
              className="icon"
              style={{ backgroundColor: this.getBackgroundColor(index) }}
            />
            {item}
          </li>
        )
      )
    );
  }

  createStyle() {
    const {
      styles
    } = this.props;

    const uid = this.uid;
    const rules = merge({}, defaultStyles, styles);

    return (
      <Style
        scopeSelector={`.legend-container-${uid}`}
        rules={rules}
      />
    );
  }

  render() {
    const {
      dataId,
      data,
      tags
    } = this.props;

    data.forEach((item) => {
      const index = tags.findIndex((tag) => tag === item[dataId]);
      if (index === -1) tags.push(item[dataId]);
    });

    const uid = this.uid;
    return (
      <div className={`legend-container-${uid}`}>
        {this.createStyle()}
        <ul className="legend">
          {this.createListItems()}
        </ul>
      </div>
    );
  }
}
