import { fetchEventSource } from "@microsoft/fetch-event-source";
let document = {
  dispatchEvent: test,
  addEventListener: test,
  removeEventListener: test,
  querySelector: test
};
let window = {
  location: {
    protocol: "",
    host: ""
  },
  clearTimeout: test
};
function test(e) {
  console.log("e:", e)
}

export default async function handler(req, res) {

  const { promptData } = req.body;
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.flushHeaders();

  try {
    const responseStreamed = await fetchEventSource("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      body: JSON.stringify(promptData),
      headers: {
        "Content-Type": "application/json",
        'Authorization': "Bearer " + process.env.OPEN_AI_KEY,
        'OpenAI-Organization': 'org-WbmUqbZDRruhWmTtqo3ToWPO'
      },
      onopen(res) {
        console.log("opening request.");
      },
      onmessage(event) {
        console.log("received event:", event);
        if(event.data != "[DONE]") {
          const parsedData = JSON.parse(event.data);
          if(parsedData?.choices[0]?.delta?.content) {
            _textResponse = _textResponse + parsedData.choices[0].delta.content;
            res.write(_textResponse);
          }
        }
      },
      async onclose() {
        res.write(`[DONE]`);
        res.end();
      },
      onerror(err) {
        console.log("There was an error from server", err);
      },
    });
  } catch(e) {
    console.log("Error retrieving response from Open AI:", e);
  }
}
