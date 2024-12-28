/* document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("btn").addEventListener("click", sendReq);
});
sendReq = async () => {
  const response = await fetch("/test", {
    method: "POST", body: JSON.stringify({ message: "Hello, World" }),
    headers: { "Content-Type": "application/json" }
  });
  document.getElementById("msg").textContent = response.statusText;
  document.getElementById("body").innerHTML = await response.text();
}; */

// import { Counter } from "./counter_custom";
import * as Counter from "@templates/counter_client.handlebars";
const context = {
  counter: 0
}
const actions = {
  incrementCounter: () => {
    context.counter++; render();
  }
}
const render = () => {
  document.getElementById("target").innerHTML = Counter(context);
}
document.addEventListener('DOMContentLoaded', () => {
  document.onclick = (ev) => {
    const action = ev.target.getAttribute("action")
    if (action && actions[action]) {
      actions[action]() // actions["incrementCounter"]()
    }
  }
  render();
});