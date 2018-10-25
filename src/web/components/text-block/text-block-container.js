import React from "react";
import Loader from "../loader/loader";
import AlternativeView from "./alternative-view";
import CommonView from "./common-view";

class TextBlockContainer extends React.Component {
  getSourceTextSentences() {
    return this.props.target.text.map(item => item.source);
  }
  getTargetTextSentences() {
    return this.props.target.text.map(item => item.target);
  }
  render() {
    return (
      <div className="text-block">
        {this.props.loading ? <Loader className="loader" /> : null}
        {this.props.source.text &&
        (!this.props.target.text || !this.props.previewAlternative) ? (
          <div
            className={`source-text${
              this.props.source.collapsed ? " collapsed" : ""
            }`}>
            <div className="header" onClick={this.props.toggleSourceText}>
              Source text
            </div>
            <div className="content">
              {this.props.source.text.split("\n").map((item, key) => {
                return (
                  <div className="sentence" key={key}>
                    <span className="source">{item}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : this.props.successMessage ? (
          <div className="success-message-wrap">
            <span className="success-message-text">
              {this.props.successMessage}
            </span>
          </div>
        ) : null}
        {this.props.error ? (
          <div className="translate error">
            {this.props.error.message || this.props.error.toString()}
          </div>
        ) : this.props.target.text ? (
          this.props.previewAlternative ? (
            <AlternativeView
              targetSentencesArray={this.getTargetTextSentences()}
              sourceSentencesArray={this.getSourceTextSentences()}
              targetLanguage={this.props.target.language.value}
              sourceLanguage={this.props.source.language.value}
              text={this.props.target.text}
            />
          ) : (
            <CommonView
              source={this.props.source}
              target={this.props.target}
              translateHighlighted={this.props.translateHighlighted}
            />
          )
        ) : null}
      </div>
    );
  }
}

export default TextBlockContainer;
