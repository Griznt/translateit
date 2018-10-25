import { SEND_TO_HUMAN } from "../const";
import makeApiRequest from "./send-request";

export function send({
  text,
  to,
  budget,
  deadline,
  userEmail,
  onSuccess,
  onFailure
}) {
  makeApiRequest({ text, to, budget, deadline, userEmail }, SEND_TO_HUMAN)
    .then(function(resp) {
      if (resp && resp.status < 300) {
        console.log(resp);
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
