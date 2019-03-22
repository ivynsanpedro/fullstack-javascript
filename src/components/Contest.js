import React, { Component } from 'react'
import PropTypes from 'prop-types';

export default class Contest extends Component {
  render() {
    return (
      <div>
        {this.props.description}
      </div>
    )
  }
}

Contest.propTypes = {
  description: PropTypes.string.isRequired
};