import React from "react";
import { translate as translateApi } from "../../axios/translate";
import { LANGUAGES } from "../../const";
import TextBlockContainer from "../text-block/text-block-container";
import FileUploadContainer from "../file-upload-container/file-upload-container";
import orderBy from "lodash/orderBy";

import "../../css/main.css";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      source: {
        collapsed: false,
        text: null,
        language: null,
        filename: null,
        extension: null
      },
      target: {
        text: null,
        language: null
      },
      loading: false,
      error: null,
      translateHighlighted: true
    };

    this.onTextLoaded = this.onTextLoaded.bind(this);
    this.onSelectSourceLanguage = this.onSelectSourceLanguage.bind(this);
    this.onSelectTargetLanguage = this.onSelectTargetLanguage.bind(this);
    this.translate = this.translate.bind(this);
    this.setError = this.setError.bind(this);
    this.clearError = this.clearError.bind(this);
    this.onTranslateSuccess = this.onTranslateSuccess.bind(this);
    this.toggleSourceText = this.toggleSourceText.bind(this);
    this.toggleHighlight = this.toggleHighlight.bind(this);
    this.getParsedLanguages = this.getParsedLanguages.bind(this);
    this.saveResults = this.saveResults.bind(this);
  }

  onTextLoaded({ text, filename, extension }) {
    if (text && text.length > 0) {
      this.setState({
        source: {
          ...this.state.source,
          text,
          filename,
          extension,
          collapsed: false
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
    this.clearError();
    this.setState({
      target: {
        ...this.state.target,
        text: orderBy(text, ["i"], ["asc"])
      },
      loading: false,
      source: { ...this.state.source, collapsed: true }
    });
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

  toggleSourceText() {
    this.setState({
      source: {
        ...this.state.source,
        collapsed: !this.state.source.collapsed
      }
    });
  }

  toggleHighlight() {
    this.setState({ translateHighlighted: !this.state.translateHighlighted });
  }

  getParsedLanguages() {
    return Object.keys(LANGUAGES).map(key => {
      return { value: key, label: LANGUAGES[key] };
    });
  }

  saveResults() {
    const element = document.createElement("a");
    const fileToDownload = this.state.target.text.map(sentence => {
      return `${sentence.source}\r\n${sentence.target}\r\n\r\n`;
    });
    const file = new Blob(fileToDownload, {
      type: "text/plain"
    });
    element.href = URL.createObjectURL(file);
    element.download = `${this.state.source.filename}_${
      this.state.source.language.value
    }_to_${this.state.target.language.value}.${
      this.state.source.extension ? this.state.source.extension : ""
    }`;
    element.click();
  }

  render() {
    const languages = this.getParsedLanguages();
    return (
      <div className="app">
        <span className="logo-text">TRANSLATE IT!</span>
        <FileUploadContainer
          languages={languages}
          onTextLoaded={this.onTextLoaded}
          loading={this.state.loading}
          source={this.state.source}
          onSelectSourceLanguage={this.onSelectSourceLanguage}
          onSelectTargetLanguage={this.onSelectTargetLanguage}
          translate={this.translate}
          target={this.state.target}
          toggleHighlight={this.toggleHighlight}
          translateHighlighted={this.state.translateHighlighted}
          saveResults={this.saveResults}
        />
        <TextBlockContainer
          loading={this.state.loading}
          source={this.state.source}
          toggleSourceText={this.toggleSourceText}
          error={this.state.error}
          target={this.state.target}
          translateHighlighted={this.state.translateHighlighted}
        />
      </div>
    );
  }
}

export default App;
