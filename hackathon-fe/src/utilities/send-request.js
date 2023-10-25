import { getToken } from "./users-service";

export default async function sendRequest(url, method = "GET", payload = null) {
  const options = { method };
  if (payload) {
    console.log("payload", payload);
    options.headers = { "Content-Type": "application/json" };
    options.body = JSON.stringify(payload);
  }
  console.log("here");
  const token = getToken();
  console.log("token1", token);

  if (token) {
    console.log("token2", token);
    options.headers = options.headers || {};
    options.headers.Authorization = `Bearer ${token}`;
  }
  console.log("options", options);
  const res = await fetch(url, options);

  if (res.ok) return res.json();
  throw new Error("Bad Request");
}
