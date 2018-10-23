import React from "react";
import ReactDropzone from "react-dropzone";
import FileInputContainer from "../input/file-input-container";
import SelectContainer from "../select/select-container";
import ButtonContainer from "../button/button-container";
import { ACCEPTED_FILE_EXTENSIONS } from "../../const";
import NumberFormat from "react-number-format";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import Input from "../input/input";

class FileUploadContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: null,
      error: null
    };

    this.uploadFile = this.uploadFile.bind(this);
    this.readFile = this.readFile.bind(this);
    this.parseFileExtension = this.parseFileExtension.bind(this);
    this.onTextLoaded = this.onTextLoaded.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  _uploadOneFile(file) {
    this.setState({
      error: null,
      selected: null
    });
    if (file) {
      const isLegalExtension = ACCEPTED_FILE_EXTENSIONS.map(extension =>
        extension.includes(this.parseFileExtension(file.name))
      ).reduce((o1, o2) => o1 || o2);

      if (isLegalExtension) {
        this.setState({ selected: file.name, error: null });

        this.readFile(file);
      } else {
        this.setState({
          error: {
            message: `Incorrect file extension!\r\nOnly [${ACCEPTED_FILE_EXTENSIONS}] is allowed.`
          }
        });
        console.error(
          `Incorrect file extension!\r\nOnly [${ACCEPTED_FILE_EXTENSIONS}] is allowed.`
        );
      }
    } else {
      this.setState({
        error: {
          message: `Incorrect file extension!\r\nOnly [${ACCEPTED_FILE_EXTENSIONS}] is allowed.`
        }
      });
    }
  }

  uploadFile(event) {
    let file = event.target.files[0];
    this._uploadOneFile(file);
  }

  readFile(file) {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = event => resolve(event.target.result);
      reader.onerror = error => reject(error);
      reader.readAsText(file);
    })
      .then(text => this.onTextLoaded(text))
      .catch(error => {
        this.setState({ error });
        console.error({ error });
      });
  }

  parseFileExtension(filename) {
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  }

  onTextLoaded(text) {
    const extension = this.parseFileExtension(this.state.selected),
      filename = extension
        ? this.state.selected.replace(extension, "")
        : "translated";

    this.props.onTextLoaded({
      text,
      filename,
      extension
    });
  }

  onDrop(acceptedFiles, rejectedFiles) {
    let file = (acceptedFiles || [""])[0];
    this._uploadOneFile(file);
  }

  render() {
    return (
      <div className="sidebar-left">
        <div className="upload-file-zone">
          <div
            className={`${
              this.props.className ? this.props.className : ""
            } error`}>
            {this.state.error
              ? this.state.error.message.split("\r\n").map((item, key) => {
                  return (
                    <span key={key}>
                      {item}
                      <br />
                    </span>
                  );
                })
              : null}
          </div>
          <ReactDropzone
            onClick={e => {
              e.preventDefault();
              return false;
            }}
            accept={ACCEPTED_FILE_EXTENSIONS}
            className="dropzone"
            activeClassName="dropzone__active"
            acceptClassName="dropzone__accepted"
            rejectClassName="dropzone__rejected"
            disabledClassName="dropzone__disabled"
            onDrop={this.onDrop}>
            <span className="dropzone__inner-text">Drop text file here!</span>
            <FileInputContainer
              className="source-text-load"
              onTextLoaded={this.onTextLoaded}
              parseFileExtension={this.parseFileExtension}
              uploadFile={this.uploadFile}
              readFile={this.readFile}
              disabled={this.props.loading}
              selected={this.state.selected}
            />
          </ReactDropzone>
        </div>
        <SelectContainer
          options={this.props.languages}
          className="language"
          settings={{
            placeholder: "target language",
            isSearchable: true,
            isDisabled: !this.props.source.text || this.props.loading
          }}
          onSelect={this.props.onSelectTargetLanguage}
        />
        <div className="premium-switcher" onClick={this.props.togglePremium}>
          <span className="label">Premium service</span>
          <div className="checkbox">
            <input
              type="checkbox"
              checked={this.props.premiumSelected}
              onChange={this.props.togglePremium}
            />
            <span />
          </div>
        </div>
        {this.props.premiumSelected ? (
          <div
            className={`premium-service${
              this.props.premiumSelected ? "" : " closed"
            }`}>
            <div className="content-inner">
              <div className="deadline">
                <span className="deadline-header">Deadline</span>
                <DatePicker
                  className="datepicker"
                  selected={this.props.deadline}
                  onChange={this.props.onDeadlineChange}
                  disabled={
                    !this.props.premiumSelected ||
                    !this.props.source.text ||
                    this.props.loading
                  }
                  startDate={moment()
                    .add(1, "day")
                    .endOf("day")}
                  dateFormat="ll"
                  minDate={moment()
                    .add(1, "day")
                    .endOf("day")}
                  timeCaption="time"
                  showTimeSelect={true}
                  minTime={moment()
                    .hours(9)
                    .minutes(0)}
                  maxTime={moment()
                    .hours(17)
                    .minutes(0)}
                  timeIntervals={60}
                />
              </div>
              <div className="budget">
                <span className="budget-header">
                  Suggested price, Your email
                </span>
                <div className="budget-input">
                  <NumberFormat
                    className={`budget-input span${
                      !this.props.premiumSelected ||
                      !this.props.source.text ||
                      this.props.loading
                        ? " disabled"
                        : ""
                    }`}
                    displayType="text"
                    thousandSeparator={true}
                    prefix={"€"}
                    value={this.props.budget.value}
                    onValueChange={this.props.onBudgetChange}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    isAllowed={({ floatValue }) =>
                      floatValue >= this.props.budget.minValue &&
                      floatValue <= 10002000
                    }
                    allowNegative={false}
                  />
                </div>
              </div>
              <Input
                className="email"
                disabled={
                  !this.props.premiumSelected ||
                  !this.props.source.text ||
                  this.props.loading
                }
                invalid={!this.props.emailIsValid}
                onDelay={this.props.onUserEmailInput}
                delay={500}
                placeholder="mail@example.com"
              />
            </div>
            <ButtonContainer
              className="send-to-human"
              // onClick={this.props.saveResults}
              disabled={
                !this.props.source.text ||
                this.props.loading ||
                !this.props.userEmail ||
                !this.props.emailIsValid
              }
              text="send to human"
            />
          </div>
        ) : (
          <div>
            <ButtonContainer
              className="translate"
              onClick={this.props.translate}
              disabled={!this.props.target.language || this.props.loading}
              text="translateIt!"
            />
            <ButtonContainer
              className="save"
              onClick={this.props.saveResults}
              disabled={!this.props.target.text || this.props.loading}
              text="save results"
            />
            <ButtonContainer
              className={`change-view${
                this.props.previewAlternative ? " enabled" : ""
              }`}
              onClick={this.props.changeView}
              disabled={!this.props.target.text || this.props.loading}
              text="change view"
            />
          </div>
        )}
      </div>
    );
  }
}

export default FileUploadContainer;
