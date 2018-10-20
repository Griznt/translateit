import React from "react";
import "./loader.css";

const Loader = props => {
  return (
    <div className={props.className}>
      <div className="lds-ellipsis">
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
};

export default Loader;
