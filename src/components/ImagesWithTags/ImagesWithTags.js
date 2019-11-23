import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Tags from '../Tags';
import './ImagesWithTags.scss';
import { STRINGS } from '../../strings';
import { FaCloudUploadAlt } from 'react-icons/fa';

class FilesWithTags extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false
    };
  }

  // source - https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
  dropHandler = function(e) {
    e.preventDefault();
    const dt = e.dataTransfer;
    const files = dt.files;
    this.setState({ hovered: false });

    handleFiles(files);
  };

  dragOverHandler = function(e) {
    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault();
    e.stopPropagation();
    this.setState({ hovered: true });
  };

  dragEnterHandler = function(e) {
    e.stopPropagation();
    e.preventDefault();
  };

  dragLeaveHandler = function(e) {
    e.stopPropagation();
    e.preventDefault();
    this.setState({ hovered: false });
  };

  onTagsChange = function(index, newTags) {
    let newValue = [].concat(this.props.value);
    newValue[index].tags = newTags;
    this.props.onValueChange(newValue);
  };

  deleteImage = function(event, index) {
    event.preventDefault();
    let newValue = [].concat(this.props.value);
    if (index !== -1) newValue.splice(index, 1);
    this.props.onValueChange(id, newValue);
  };

  handleFiles = async function(files) {
    let fileObjs = [];

    const acceptedFiles = Array.from(files).filter(file =>
      file.type.startsWith('image/')
    );

    function readFileAsync(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onload = () => {
          resolve(reader.result);
        };

        reader.onerror = reject;

        reader.readAsDataURL(file);
      });
    }

    for (var i = 0; i < acceptedFiles.length; i++) {
      try {
        let dataUrl = await readFileAsync(acceptedFiles[i]);
        fileObjs.push({
          fileUrl: dataUrl,
          tags: []
        });
      } catch (err) {
        console.log(err);
      }
    }

    let newValue = [].concat(this.props.value, fileObjs);
    this.props.onValueChange(this.props.id, newValue);
  };

  render() {
    const { id, label, disabled, value, errorString, className } = this.props;
    return (
      <div
        className={
          `${className ? className : ''} ` +
          (errorString !== ''
            ? 'files__container files__container--error'
            : 'files__container')
        }>
        <input
          type="file"
          id={id}
          multiple
          disabled={disabled}
          accept="image/*"
          className="files__input--visuallyHidden"
          onChange={e => this.handleFiles(e.target.files)}
        />
        <div
          className={
            'files__dropZone ' +
            (this.state.hovered ? 'files__dropZone--active' : '')
          }
          onDrop={this.dropHandler}
          onDragOver={this.dragOverHandler}
          onDragLeave={this.dragLeaveHandler}>
          <FaCloudUploadAlt className="files__uploadIcon" size="3em" />
          <label className="files__label" htmlFor={id}>
            {label}
          </label>
        </div>

        <div className="files__preview">
          {value.map((imageObj, index) => {
            return (
              <div key={`preview${index}`} className="file__previewContainer">
                <a
                  href="#"
                  onClick={e => this.deleteImage(event, index)}
                  className="file__cross">
                  x
                </a>
                <div className="file__previewImageContainer">
                  <img className="file__preview" src={imageObj.fileUrl} />
                </div>
                <div className="file__tagsContainer">
                  <Tags
                    value={imageObj.tags}
                    label={STRINGS.IMAGE_TAGS_LABEL}
                    id={`${id}--imageTags--${index}`}
                    onValueChange={(id, value) =>
                      this.onTagsChange(index, value)
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="files__feedbackMessage">{errorString}</div>
      </div>
    );
  }
}

FilesWithTags.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onValueChange: PropTypes.func,
  errorString: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  value: PropTypes.arrayOf(
    PropTypes.shape({
      fileUrl: PropTypes.string,
      tags: PropTypes.array
    })
  )
};

FilesWithTags.defaultProps = {
  onValueChange: () => {},
  errorString: '',
  forceChoose: false,
  disabled: false,
  required: false,
  multiple: false,
  value: []
};

export default FilesWithTags;
