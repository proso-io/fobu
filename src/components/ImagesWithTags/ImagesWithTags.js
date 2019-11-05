import React from 'react';
import PropTypes from 'prop-types';
import Tags from '../Tags';
import './ImagesWithTags.scss';
import { STRINGS } from '../../constants';
import { FaCloudUploadAlt } from 'react-icons/fa';

function FilesWithTags(props) {
  const {
    id,
    label,
    onValueChange,
    disabled,
    required,
    value,
    errorString
  } = props;

  function handleFiles(files) {
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

    async function processFile(file) {
      try {
        let dataUrl = await readFileAsync(file);
        setTimeout(function() {
          let newValue = [].concat(value);
          newValue.push({
            fileUrl: dataUrl,
            tags: []
          });
          onValueChange(id, newValue);
        });
      } catch (err) {
        console.log(err);
      }
    }

    acceptedFiles.forEach(file => processFile(file));
  }

  // source - https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
  function dropHandler(e) {
    e.preventDefault();
    const dt = e.dataTransfer;
    const files = dt.files;

    handleFiles(files);
  }

  function dragOverHandler(e) {
    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault();
  }

  function onTagsChange(index, newTags) {
    let newValue = [].concat(value);
    newValue[index].tags = newTags;
    onValueChange(newValue);
  }

  return (
    <div
      className={
        errorString !== ''
          ? 'files__container files__container--error'
          : 'files__container'
      }>
      <input
        type="file"
        id="fileElem"
        multiple
        accept="image/*"
        className="files__input--visuallyHidden"
        onChange={e => handleFiles(e.target.files)}
      />
      <div
        className="files__dropZone"
        onDrop={dropHandler}
        onDragOver={dragOverHandler}>
        <FaCloudUploadAlt className="files__uploadIcon" size="3em" />
        <label className="files__label" htmlFor="fileElem">
          {label}
        </label>
      </div>

      <div className="files__preview">
        {value.map((imageObj, index) => {
          return (
            <div key={`preview${index}`} className="file__previewContainer">
              <div className="file__previewImageContainer">
                <img className="file__preview" src={imageObj.fileUrl} />
              </div>
              <div className="file__tagsContainer">
                <Tags
                  value={imageObj.tags}
                  label={STRINGS.IMAGE_TAGS_LABEL}
                  id={`${id}--imageTags--${index}`}
                  onValueChange={(id, value) => onTagsChange(index, value)}
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
