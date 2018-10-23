import React from "react";

const commonView = props => {
  return (
    <div className={`target-text${props.source.collapsed ? " extended" : ""}`}>
      <div className="header">Translated text</div>
      <div className={`content${props.source.collapsed ? " extended" : ""}`}>
        {props.target.text.map((item, key) => {
          return (
            <div className="sentence" key={key}>
              <span className="source">{item.source}</span>
              <span
                className={`target${
                  props.translateHighlighted ? " highlighted" : ""
                }`}
              >
                {item.target}
              </span>
              <br />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default commonView;
