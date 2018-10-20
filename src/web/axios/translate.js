import axios from "axios";
import { TRANSLATE_API_URL } from "../const";

// Abstract API request function
function makeApiRequest(data, authNeeded) {
  // Return response from API
  return axios.post(TRANSLATE_API_URL, {
      text: data.source.text,
      from: data.source.language.value,
      to: data.target.language.value,
      dataType: "json",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
  });
}

// Translate
export function translate(data, onSuccess, onFailure) {
  makeApiRequest(data, false)
    .then(function(resp) {
      if (resp && resp.status === 200) {
        onSuccess(resp.data);
      } else {
        onFailure(
          `Request failed${resp ? ` with status: ${resp.status}` : ""}`
        );
      }
    })
    .catch(error => {
      console.error(error);
      onFailure(`Error occured: ${error.message ? error.message : error}`);
    });
}
