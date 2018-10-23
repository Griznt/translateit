import React from "react";

const alternativeView = props => {
  console.log({ props });
  return (
    <div className="alternative-text">
      <table className="alternative-text-table">
        <tr>
          <td>
            <div className="header">{props.sourceLanguage}</div>
          </td>
          <td>
            <div className="header">{props.targetLanguage}</div>
          </td>
        </tr>
        {props.text.map((item, key) => {
          return (
            <tr key={key} className="sentence">
              <td className="sentence">
                <span className="source">{item.source}</span>
              </td>
              <td className="sentence">
                <span className="target">{item.target}</span>
              </td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

export default alternativeView;
