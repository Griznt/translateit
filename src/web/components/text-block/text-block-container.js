import React from "react";
import Loader from "../loader/loader";

class TextBlockContainer extends React.Component {
  render() {
    return (
      <div className="text-block">
        {this.props.loading ? <Loader className="loader" /> : null}
        {this.props.source.text ? (
          <div className="source-text">
            <div className="header">Source text</div>
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
        ) : null}
        {this.props.error ? (
          <div className="error">{this.props.error}</div>
        ) : this.props.target.text ? (
          <div className="target-text">
            <div className="header">Translated text</div>
            <div className="content">
              {this.props.target.text.map((item, key) => {
                return (
                  <div className="sentence" key={key}>
                    <span className="source">{item.source}</span>
                    <span className="target">{item.target}</span>
                    <br />
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default TextBlockContainer;
