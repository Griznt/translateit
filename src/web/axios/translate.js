import axios from "axios";
import { TRANSLATE_API_URL } from "../const";

function makeApiRequest(data, authNeeded) {
  let url = "";
  if (process.env.NODE_ENV === "development") {
    const [host] = window.location.host.split(":") || [];
    url = `${
      process.env.HTTPS === "true" ? "https" : "http"
    }://${host}:${process.env.HTTP || "3000"}${TRANSLATE_API_URL}`;
  } else url = TRANSLATE_API_URL;

  return axios.post(url, {
    text: data.source.text,
    // from: data.source.language.value,
    to: data.target.language.value,
    dataType: "json",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  });
}

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
