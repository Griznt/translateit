import React from "react";

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ""
    };
    this.className = props.className || "input";

    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onDelay = this.onDelay.bind(this);
    this.timerId = 0;
  }

  onChange(e) {
    const text = e.target.value;
    this.setState({ text });
    if (this.props.onChange) this.props.onChange(text);
    if (this.timerId) clearTimeout(this.timerId);
    this.onDelay();
  }

  onDelay() {
    if (this.props.onDelay) {
      this.timerId = setTimeout(
        () => this.props.onDelay(this.state.text),
        this.props.delay || 500
      );
    }
  }

  onBlur() {
    if (this.props.onBlur) this.props.onBlur(this.state.text);
  }

  render() {
    return (
      <div className={this.className}>
        {this.props.label ? (
          <label className={`${this.className}-label`}>
            {this.props.label}
          </label>
        ) : null}

        <input
          id={`${this.props.id ? this.props.id : ""}`}
          className={`${this.className}-input${
            this.props.invalid ? " invalid" : ""
          }`}
          type={this.props.type || "input"}
          onChange={this.onChange}
          onBlur={this.onBlur}
          accept={this.props.accept}
          disabled={this.props.disabled}
        />
      </div>
    );
  }
}

export default Input;
