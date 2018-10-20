import React from "react";
import { ACCEPTED_FILE_EXTENSIONS } from "../../const";

class FileInputContainer extends React.Component {
  render() {
    return (
      <div className="file-upload">
        <label className="file-upload__label">
          {this.props.selected ? this.props.selected : "Select file"}
          <input
            id="upload"
            className="file-upload__input"
            type="file"
            name="file-upload"
            onChange={this.props.uploadFile}
            accept={ACCEPTED_FILE_EXTENSIONS}
            disabled={this.props.disabled}
          />
        </label>
      </div>
    );
  }
}

export default FileInputContainer;
