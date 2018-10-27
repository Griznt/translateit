import React from "react";

import { translate as translateApi } from "../../axios/translate";
import { send as sendToHumanApi } from "../../axios/send-to-human";
import TextBlockContainer from "../text-block/text-block-container";
import FileUploadContainer from "../file-upload-container/file-upload-container";
import orderBy from "lodash/orderBy";
import { Parser } from "json2csv";
import moment from "moment";
import "../../css/main.css";

import {
  LANGUAGES,
  ONE_WORD_PRICE,
  EMAIL_REGEXP,
  START_PRICE
} from "../../const";

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
      translateHighlighted: true,
      premiumSelected: false,
      deadline: moment()
        .add(1, "day")
        .startOf("day")
        .add(17, "hour"),
      budget: {
        value: START_PRICE,
        minValue: START_PRICE
      },
      userEmail: "",
      emailIsValid: false,
      previewAlternative: true
    };

    this.onTextLoaded = this.onTextLoaded.bind(this);
    this.onSelectSourceLanguage = this.onSelectSourceLanguage.bind(this);
    this.onSelectTargetLanguage = this.onSelectTargetLanguage.bind(this);
    this.translate = this.translate.bind(this);
    this.setError = this.setError.bind(this);
    this.clearError = this.clearError.bind(this);
    this.onTranslateSuccess = this.onTranslateSuccess.bind(this);
    this.toggleSourceText = this.toggleSourceText.bind(this);
    this.togglePremium = this.togglePremium.bind(this);
    this.getParsedLanguages = this.getParsedLanguages.bind(this);
    this.saveResults = this.saveResults.bind(this);
    this.onDeadlineChange = this.onDeadlineChange.bind(this);
    this.onBudgetChange = this.onBudgetChange.bind(this);
    this.billWordsCount = this.billWordsCount.bind(this);
    this.calculateWordsCount = this.calculateWordsCount.bind(this);
    this.onUserEmailInput = this.onUserEmailInput.bind(this);
    this.changeView = this.changeView.bind(this);
    this.formatDeadline = this.formatDeadline.bind(this);
    this.sendToHuman = this.sendToHuman.bind(this);
    this.onSendToHumanSuccess = this.onSendToHumanSuccess.bind(this);
    this.setSuccessMessage = this.setSuccessMessage.bind(this);
    this.clearSuccessMessage = this.clearSuccessMessage.bind(this);
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
      this.calculateWordsCount(text);
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

  getSourceLang(text) {
    return new Set(
      text.filter(
        lang => lang && lang !== "" && lang !== this.state.target.language.value
      )
    );
  }

  setSuccessMessage(text) {
    this.setState({ successMessage: text });
    setTimeout(this.clearSuccessMessage, 5000);
  }
  clearSuccessMessage() {
    this.setState({ successMessage: null });
  }

  onSendToHumanSuccess(text) {
    this.clearError();
    this.setSuccessMessage(text);
    this.setState({
      loading: false,
      source: {},
      target: {},
      premiumSelected: false,
      userEmail: "",
      deadline: moment()
        .add(1, "day")
        .startOf("day")
        .add(17, "hour"),
      budget: {
        value: START_PRICE,
        minValue: START_PRICE
      }
    });
  }

  onTranslateSuccess(text) {
    this.clearError();

    let [sourceLang] = this.getSourceLang(
      text.map(sentence => sentence.sourceLang)
    );
    if (!sourceLang) sourceLang = this.state.target.language.value;
    this.setState({
      target: {
        ...this.state.target,
        text: orderBy(text, ["i"], ["asc"])
      },
      loading: false,
      source: {
        ...this.state.source,
        collapsed: true,
        language: { value: sourceLang, label: LANGUAGES[sourceLang] }
      }
    });
  }

  changeView() {
    this.setState({ previewAlternative: !this.state.previewAlternative });
  }

  billWordsCount(wordsCount) {
    this.setState({
      budget: {
        value: START_PRICE + ONE_WORD_PRICE * wordsCount,
        minValue: START_PRICE + ONE_WORD_PRICE * wordsCount
      }
    });
  }

  sendToHuman() {
    if (
      !(
        this.state.budget &&
        this.state.deadline &&
        this.state.emailIsValid &&
        this.state.target.language &&
        this.state.source.text
      )
    ) {
      this.setError("Some of fields are not specified...");
      setTimeout(this.clearError, 1000);
    } else {
      this.setState({ loading: true });
      this.clearError();
      const { budget, deadline, source, target, userEmail } = this.state;

      try {
        sendToHumanApi({
          budget: budget.value,
          deadline: deadline.format("lll"),
          to: target.language.value,
          text: source.text,
          filename: source.filename,
          userEmail,
          onSuccess: this.onSendToHumanSuccess,
          onFailure: this.setError
        });
      } catch (error) {
        this.setError(error);
      }
    }
  }

  translate() {
    if (!(this.state.target.language && this.state.source.text)) {
      this.setError("Some of fields are not specified...");
      setTimeout(this.clearError, 1000);
    } else {
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

  togglePremium() {
    this.setState({ premiumSelected: !this.state.premiumSelected });
  }

  formatDeadline(deadlineValue) {
    return deadlineValue === this.state.deadline;
  }

  onDeadlineChange(deadline) {
    if (deadline) this.setState({ deadline });
  }
  onBudgetChange({ value }) {
    if (value)
      this.setState({
        budget: { ...this.state.budget, value }
      });
  }

  calculateWordsCount(text) {
    const wordsCount = text
      .trim()
      .split(" ")
      .filter(word => word.match(/[\w\d]+/g))
      .map(() => 1)
      .reduce((acc, item) => acc + item, 0);
    this.billWordsCount(wordsCount);
  }

  onUserEmailInput(userEmail) {
    this.setState({ userEmail });
    this.setState({ emailIsValid: !!userEmail.match(EMAIL_REGEXP) });
  }

  getParsedLanguages() {
    return Object.keys(LANGUAGES).map(key => {
      return { value: key, label: LANGUAGES[key] };
    });
  }

  saveToCSV(arrayofObjects) {
    try {
      const fields = Object.keys(arrayofObjects[0]);
      const parser = new Parser({ fields });
      const csvFile = parser.parse(arrayofObjects);

      return csvFile;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  downloadCsv(csv, filename) {
    const hiddenElement = document.createElement("a");
    hiddenElement.href =
      "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURIComponent(csv);
    hiddenElement.target = "_blank";
    hiddenElement.download = `${filename}.csv`;
    hiddenElement.click();
  }

  saveResults() {
    const from = this.state.source.language.value,
      to = this.state.target.language.value;
    const jsonArray = [];
    this.state.target.text.forEach(sentence => {
      const json = {};
      json[from] = sentence.source;
      json[to] = sentence.target;
      jsonArray.push(json);
    });

    let csvDocument = null;
    try {
      csvDocument = this.saveToCSV(jsonArray);
    } catch (err) {
      console.error(err);
    }

    this.downloadCsv(
      csvDocument,
      `${this.state.source.filename}${from}_to_${to}`
    );
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
          togglePremium={this.togglePremium}
          premiumSelected={this.state.premiumSelected}
          saveResults={this.saveResults}
          deadline={this.state.deadline}
          onDeadlineChange={this.onDeadlineChange}
          budget={this.state.budget}
          onBudgetChange={this.onBudgetChange}
          userEmail={this.state.userEmail}
          onUserEmailInput={this.onUserEmailInput}
          emailIsValid={this.state.emailIsValid}
          changeView={this.changeView}
          previewAlternative={this.state.previewAlternative}
          formatDeadline={this.formatDeadline}
          sendToHuman={this.sendToHuman}
          languageValue={this.state.target.language}
        />
        <TextBlockContainer
          loading={this.state.loading}
          source={this.state.source}
          toggleSourceText={this.toggleSourceText}
          error={this.state.error}
          target={this.state.target}
          translateHighlighted={this.state.translateHighlighted}
          previewAlternative={this.state.previewAlternative}
          successMessage={this.state.successMessage}
          clearSuccessMessage={this.clearSuccessMessage}
        />
      </div>
    );
  }
}

export default App;
