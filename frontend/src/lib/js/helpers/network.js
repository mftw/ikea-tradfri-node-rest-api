export const requestSender = (route, req, options) =>
  // fetch("http://10.77.107.137:3500/" + route, {
  fetch("http://localhost:3500/" + route, {
    method: "POST",
    body: JSON.stringify(req),
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });
