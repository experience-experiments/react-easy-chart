import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Style } from 'radium';
import {
  scaleOrdinal,
  schemeCategory20,
  range
 } from 'd3';
import {
  createUniqueID
} from '../shared';
import merge from 'lodash.merge';

import defaultStyles from './defaultStyles';

const colors = scaleOrdinal(schemeCategory20).domain(range(0, 20)).range();

export default class Legend extends PureComponent {

  static get propTypes() {
    return {
      config: PropTypes.array,
      data: PropTypes.array.isRequired,
      tags: PropTypes.array,
      dataId: PropTypes.string.isRequired,
      horizontal: PropTypes.bool,
      styles: PropTypes.object
    };
  }

  static get defaultProps() {
    return {
      tags: []
    };
  }

  constructor(props) {
    super(props);
    this.uid = createUniqueID(props);
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

  createLegend() {
    const {
      dataId,
      data,
      tags,
      horizontal
    } = this.props;

    const className =
      (horizontal)
        ? 'horizontal'
        : '';

    data.forEach((item) => {
      const index = tags.findIndex((tag) => tag === item[dataId]);
      if (index < 0) tags.push(item[dataId]);
    });

    return (
      <ul className="legend">
        {tags.map((item, index) => {
          const key = `legend-${index}`;
          const backgroundColor = this.getBackgroundColor(index);
          return (
            <li key={key} className={className}>
              <span
                className="icon"
                style={{ backgroundColor }}
              />
              {item}
            </li>
          );
        })}
      </ul>
    );
  }

  createStyle() {
    const {
      styles
    } = this.props;

    const uid = this.uid;
    const rules = merge({}, defaultStyles, styles);
    const scope = `.legend-container-${uid}`;

    return (
      <Style
        scopeSelector={scope}
        rules={rules}
      />
    );
  }

  render() {
    const uid = this.uid;
    const className = `legend-container-${uid}`;
    return (
      <div className={className}>
        {this.createStyle()}
        {this.createLegend()}
      </div>
    );
  }
}
