import { TRANSLATE_API_URL } from "../const";
import makeApiRequest from "./send-request";

export function translate({ source, target }, onSuccess, onFailure) {
  makeApiRequest(
    {
      text: source.text,
      // from
      to: target.language.value
    },
    TRANSLATE_API_URL
  )
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
