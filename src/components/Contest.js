import React, { Component } from 'react'
import PropTypes from 'prop-types';

export default class Contest extends Component {
  render() {
    return (
      <div>
        {this.props.id}
      </div>
    )
  }
}

Contest.propTypes = {
  id: PropTypes.number.isRequired
};