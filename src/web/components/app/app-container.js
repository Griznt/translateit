import React from "react";
import { translate as translateApi } from "../../axios/translate";
import { LANGUAGES } from "../../const";
import TextBlockContainer from "../text-block/text-block-container";
import FileUploadContainer from "../file-upload-container/file-upload-container";
import orderBy from "lodash/orderBy";
import App from "./app";

class AppContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      source: {
        text: null,
        language: null,
        filename: null,
        extension: null
      },
      target: {
        text: null,
        language: null
      },
      dueDate: null,
      email: "",
      loading: false,
      error: null,
      successMessage: null
    };

    this.onTextLoaded = this.onTextLoaded.bind(this);
    this.onSelectSourceLanguage = this.onSelectSourceLanguage.bind(this);
    this.onSelectTargetLanguage = this.onSelectTargetLanguage.bind(this);
    this.translate = this.translate.bind(this);
    this.setError = this.setError.bind(this);
    this.clearError = this.clearError.bind(this);
    this.onTranslateSuccess = this.onTranslateSuccess.bind(this);
    this.setSuccessMessage = this.setSuccessMessage.bind(this);
  }

  onTextLoaded({ text, filename, extension }) {
    if (text && text.length > 0) {
      this.setState({
        source: {
          ...this.state.source,
          text,
          filename,
          extension
        },
        target: {
          ...this.state.target,
          text: null
        }
      });
    }
  }

  onSelectSourceLanguage(language) {
    this.setState({ source: { ...this.state.source, language } });
    this.clearError();
  }

  onSelectTargetLanguage(language) {
    this.setState({ target: { ...this.state.target, language } });
    this.clearError();
  }

  onTranslateSuccess(text) {
    this.setSuccessMessage("translation success!");
  }

  translate() {
    this.setState({ loading: true });
    this.clearError();
    const { source, target } = this.state;

    try {
      translateApi(
        {
          source,
          target
        },
        this.onTranslateSuccess,
        this.setError
      );
    } catch (error) {
      this.setError(error);
    }
  }

  setError(error) {
    this.setState({ error, loading: false });
  }

  clearError() {
    this.setState({ error: null });
  }

  setSuccessMessage(successMessage) {
    this.setState({ successMessage });
  }

  getParsedLanguages() {
    return Object.keys(LANGUAGES).map(key => {
      return { value: key, label: LANGUAGES[key] };
    });
  }

  render() {
    const languages = this.getParsedLanguages();
    return (
      <div className="app">
        <App languages={languages} />
        {/* <span className="logo-text">TRANSLATE IT!</span>
        <FileUploadContainer
          languages={languages}
          onTextLoaded={this.onTextLoaded}
          loading={this.state.loading}
          source={this.state.source}
          onSelectSourceLanguage={this.onSelectSourceLanguage}
          onSelectTargetLanguage={this.onSelectTargetLanguage}
          translate={this.translate}
          target={this.state.target}
        />
        <TextBlockContainer
          loading={this.state.loading}
          source={this.state.source}
          error={this.state.error}
          target={this.state.target}
        /> */}
      </div>
    );
  }
}

export default AppContainer;
