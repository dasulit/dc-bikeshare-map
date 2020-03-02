import React from 'react';
import PropTypes from 'prop-types';

class Tooltip extends React.Component {
  static propTypes = {
    featureProperties: PropTypes.object.isRequired
  };

  renderCapitalBikeProperties = properties => {
    return (
      <div className="tooltip capital-bikeshare">
        <b>Capital Bikeshare station</b>
        <div className="margin-bottom-10">{properties.name}</div>
        <ul>
          <li>Available bikes: {properties.bikes}</li>
          <li>Available docks: {properties.docks}</li>
        </ul>
      </div>
    );
  };

  renderJumpProperties = properties => {
    return (
      <div className="tooltip jump">
        <b>JUMP Bike</b> {properties.battery} battery
      </div>
    );
  };

  render() {
    const { featureProperties } = this.props;
    if (featureProperties.provider === 'capital-bikeshare') {
      return this.renderCapitalBikeProperties(featureProperties);
    } else if (featureProperties.provider === 'jump') {
      return this.renderJumpProperties(featureProperties);
    } else {
      return null;
    }
  }
}

export default Tooltip;
