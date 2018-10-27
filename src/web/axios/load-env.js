import { APP_CONFIG_API_URL } from "../const";
import makeApiRequest from "./send-request";

export function loadEnv({ onSuccess, onFailure }) {
  makeApiRequest(null, APP_CONFIG_API_URL, "get")
    .then(function(resp) {
      if (resp && resp.status < 300) {
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
