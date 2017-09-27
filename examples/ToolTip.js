import React from 'react';
import PropTypes from 'prop-types';
import { Style } from 'radium';

const toolTipStyles = {
  '.tooltip': {
    border: 'solid silver 1px',
    position: 'fixed',
    backgroundColor: 'white',
    borderRadius: '4px',
    padding: '10px'
  }
};

const ToolTip = (props) => (
  <div className="tooltip-container">
    <Style scopeSelector=".tooltip-container" rules={toolTipStyles} />
    <div className="tooltip" style={{ top: props.top, left: props.left }}>
      {props.children}
    </div>
  </div>
);

// https://github.com/yannickcr/eslint-plugin-react/issues/7
ToolTip.propTypes = {
  left: PropTypes.string,
  top: PropTypes.string,
  children: PropTypes.node
};

export default ToolTip;
