import React from 'react';
import PropTypes from 'prop-types';
import './GroupContainer.scss';

function GroupContainer(props) {
  const {id, title, description,children} = props;
  return (
    <div className="group" id={id}>
      <div className="group__label">
        <p className="group__title"><strong>{title}</strong></p>
        <p className="group__description">{description}</p>
      </div>
      <div className="group__formGroup">{children}</div>
    </div>
  )
}

GroupContainer.propTypes = {
 id: PropTypes.string.isRequired,
 title: PropTypes.string.isRequired,
 description: PropTypes.string
}

GroupContainer.defaultProps = {
  description: ""
}

export default GroupContainer;
