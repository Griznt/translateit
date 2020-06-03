import React from "react";

import Select from "react-select";

class SelectContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: null
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(selectedOption) {
    if (this.state.selectedOption !== selectedOption) {
      this.setState({ selectedOption });
      this.props.onSelect(selectedOption);
    }
  }
  render() {
    const { selectedOption } = this.state;

    return (
      <div className={`select ${this.props.className}`}>
        <Select
          classNamePrefix={this.props.className}
          value={selectedOption}
          onChange={this.handleChange}
          options={this.props.options}
          {...this.props.settings}
        />
      </div>
    );
  }
}

export default SelectContainer;
