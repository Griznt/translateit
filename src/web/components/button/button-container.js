import React from "react";

class ButtonContainer extends React.Component {
  render() {
    return (
      <button
        className={`button ${this.props.className}`}
        onClick={this.props.onClick}
        disabled={this.props.disabled}
      >
        {this.props.text}
      </button>
    );
  }
}

export default ButtonContainer;
