import React from 'react';
import PropTypes from 'prop-types';
import './SectionContainer.scss';

function SectionContainer(props) {
  const {id, title, description,children} = props;
  return (
    <section className="section" id={id}>
      <h3 className="section__title">{title}</h3>
      <p className="section__description">{description}</p>
      <div className="section__contents">
        {children}
      </div>
    </section>
  )
}

SectionContainer.propTypes = {
 id: PropTypes.string.isRequired,
 title: PropTypes.string.isRequired,
 description: PropTypes.string
}

SectionContainer.defaultProps = {
  description: ""
}

export default SectionContainer;
