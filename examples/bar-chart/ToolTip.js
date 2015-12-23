import React from 'react';
import { Style } from 'radium';


const toolTipStyles = {
  '.tooltip': {
    border: 'solid silver 1px',
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: '4px',
    boxShadow: '5px 5px 8px #CCC',
    padding: '10px'
  }
};

class ToolTip extends React.Component {

  render() {
    return (<div className="tooltip-container">
      <Style scopeSelector=".tooltip-container" rules={toolTipStyles}/>
      <div className="tooltip" style={{'top': this.props.top, 'left': this.props.left}}>
        {this.props.children}
      </div>
    </div>);
  }
}

ToolTip.propTypes = {
  left: React.PropTypes.string,
  top: React.PropTypes.string
};

export default ToolTip;
