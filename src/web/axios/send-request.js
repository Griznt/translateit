import axios from "axios";

export default function makeApiRequest(data = {}, apiUrl, METHOD) {
  let url = "";
  if (process.env.NODE_ENV === "development") {
    const [host] = window.location.host.split(":") || [];
    url = `${
      process.env.HTTPS === "true" ? "https" : "http"
    }://${host}:${process.env.HTTP || "3000"}${apiUrl}`;
  } else url = apiUrl;

  return axios[METHOD || "post"](url, {
    ...data,
    dataType: "json",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  });
}
