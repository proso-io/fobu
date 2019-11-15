import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Modal.scss';

class Modal extends Component {
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
  }

  handleClick = e => {
    if (this.props.open && !this.node.contains(e.target)) {
      this.props.onClose();
    }
  };

  render() {
    return (
      <div>
        <div
          className={`modal__backdrop ${
            this.props.open ? 'visible' : 'hidden'
          }`}></div>
        <div
          className={`modal__container ${
            this.props.open ? 'visible' : 'hidden'
          }`}
          ref={node => (this.node = node)}>
          <div className="modal__close-btn">
            <a href="#" onClick={this.props.onClose}>
              x
            </a>
          </div>
          {this.props.title && (
            <div className="modal__title">
              <h3>{this.props.title}</h3>
            </div>
          )}
          <div className="modal__body">{this.props.children}</div>
          {this.props.footerChildren && (
            <div className="modal__footer">{this.props.footerChildren}</div>
          )}
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  footerChildren: PropTypes.element,
  title: PropTypes.string,
  onClose: PropTypes.func
};

Modal.defaultProps = {
  title: '',
  onClose: () => {},
  footerChildren: null
};

export default Modal;
