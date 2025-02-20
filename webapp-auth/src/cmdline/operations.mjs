import { input } from "@inquirer/prompts";

const baseUrl = "http://localhost:5000";
let bearer_token;

export const ops = {
  "Sign In": async () => {
    const creds = {
      username: await input({ message: "Username?" }),
      password: await input({ message: "Password?" }),
    };
    const response = await sendRequest("POST", "/api/signin", creds);
    if (response.success == true) {
      bearer_token = response.token;
    };
  },
  "Sign Out": () => { bearer_token = undefined },
  "Get All": () => sendRequest("GET", "/api/results"),
  "Get Name": async () => {
    const name = await input({ message: "Name?" });
    await sendRequest("GET", `/api/results?name=${name}`);
  },
  "Get ID": async () => {
    const id = await input({ message: "ID?" });
    await sendRequest("GET", `/api/results/${id}`);
  },
  "Store": async () => {
    const values = {
      name: await input({ message: "Name?" }),
      age: await input({ message: "Age?" }),
      years: await input({ message: "Years?" })
    };
    await sendRequest("POST", "/api/results", values);
  },
  "Delete": async () => {
    const id = await input({ message: "ID?" });
    await sendRequest("DELETE", `/api/results/${id}`);
  },
  "Replace": async () => {
    const id = await input({ message: "ID?" });
    const values = {
      name: await input({ message: "Name?" }),
      age: await input({ message: "Age?" }),
      years: await input({ message: "Years?" }),
      nextage: await input({ message: "Next Age?" })
    };
    await sendRequest("PUT", `/api/results/${id}`, values);
  },
  "Modify": async () => {
    const id = await input({ message: "ID?" });
    const values = {
      name: await input({ message: "Name?" }),
      age: await input({ message: "Age?" }),
      years: await input({ message: "Years?" }),
      nextage: await input({ message: "Next Age?" })
    };
    await sendRequest("PATCH", `/api/results/${id}`,
      /* Object.fromEntries(Object.entries(values)
        .filter(([p, v]) => v !== ""))); */
      Object.entries(values).filter(([p, v]) => v !== "")
        .map(([p, v]) => ({ op: "replace", path: "/" + p, value: v })),
      "application/json-patch+json");
  },
  "Test": () => {
    console.log("Test operation selected");
  },
  "Exit": () => {
    console.log("bye");
    process.exit()
  }
}

const sendRequest = async (method, url, body, contentType) => {
  const headers = { "Content-Type": contentType ?? "application/json" };
  if (bearer_token) {
    headers["Authorization"] = "Bearer " + bearer_token;
  }
  const response = await fetch(baseUrl + url, {
    method,
    headers,
    body: JSON.stringify(body)
  });
  if (response.status == 200) {
    const data = await response.json();
    (Array.isArray(data) ? data : [data]).forEach(elem => console.log(JSON.stringify(elem)));
    return data;
  } else {
    console.log(response.status + " " + response.statusText);
  }
}